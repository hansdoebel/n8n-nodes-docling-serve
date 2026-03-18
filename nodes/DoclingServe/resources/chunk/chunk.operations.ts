import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS, type ChunkerType } from "../../constants";
import { doclingApiRequest } from "../../helpers/api";
import { prepareBinaryData } from "../../helpers/binary";
import { pollUntilComplete, getTaskResult } from "../../helpers/polling";
import type {
  ChunkingOptions,
  ChunkRequest,
  ConvertOptions,
} from "../../types/requests";
import type { TaskStatusResponse } from "../../types/responses";

const CHUNK_ENDPOINT_MAP: Record<string, string> = {
  "hybrid:file:async": ENDPOINTS.CHUNK_HYBRID_FILE_ASYNC,
  "hybrid:file:sync": ENDPOINTS.CHUNK_HYBRID_FILE,
  "hybrid:source:async": ENDPOINTS.CHUNK_HYBRID_SOURCE_ASYNC,
  "hybrid:source:sync": ENDPOINTS.CHUNK_HYBRID_SOURCE,
  "hierarchical:file:async": ENDPOINTS.CHUNK_HIERARCHICAL_FILE_ASYNC,
  "hierarchical:file:sync": ENDPOINTS.CHUNK_HIERARCHICAL_FILE,
  "hierarchical:source:async": ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE_ASYNC,
  "hierarchical:source:sync": ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE,
};

const CHUNK_FIELD_MAPPINGS = [
  { uiField: "maxTokens", target: "chunking", apiField: "max_tokens", formField: "max_tokens" },
  { uiField: "mergePeers", target: "chunking", apiField: "merge_peers", formField: "merge_peers" },
  { uiField: "includeRawText", target: "chunking", apiField: "include_raw_text", formField: "chunking_include_raw_text" },
  { uiField: "tokenizer", target: "chunking", apiField: "tokenizer", formField: "tokenizer" },
  { uiField: "useMarkdownTables", target: "chunking", apiField: "use_markdown_tables", formField: "use_markdown_tables" },
  { uiField: "ocrEngine", target: "convert", apiField: "ocr_engine", formField: "convert_ocr_engine" },
  { uiField: "imageExportMode", target: "convert", apiField: "image_export_mode", formField: "convert_image_export_mode" },
  { uiField: "doOcr", target: "convert", apiField: "do_ocr", formField: "convert_do_ocr" },
  { uiField: "forceOcr", target: "convert", apiField: "force_ocr", formField: "convert_force_ocr" },
  { uiField: "tableMode", target: "convert", apiField: "table_mode", formField: "convert_table_mode" },
  { uiField: "pipeline", target: "convert", apiField: "pipeline", formField: "convert_pipeline" },
  { uiField: "doTableStructure", target: "convert", apiField: "do_table_structure", formField: "convert_do_table_structure" },
  { uiField: "includeImages", target: "convert", apiField: "include_images", formField: "convert_include_images" },
  { uiField: "imagesScale", target: "convert", apiField: "images_scale", formField: "convert_images_scale" },
  { uiField: "documentTimeout", target: "convert", apiField: "document_timeout", formField: "convert_document_timeout" },
] as const;

function getChunkEndpoint(
  chunkerType: ChunkerType,
  isFile: boolean,
  isAsync: boolean,
): string {
  const key = `${chunkerType}:${isFile ? "file" : "source"}:${isAsync ? "async" : "sync"}`;
  return CHUNK_ENDPOINT_MAP[key];
}

function buildChunkOptions(additionalOptions: IDataObject): {
  chunkingOptions?: ChunkingOptions;
  convertOptions?: ConvertOptions;
  includeConvertedDoc: boolean;
} {
  const chunkingOptions: Record<string, unknown> = {};
  const convertOptions: Record<string, unknown> = {};
  const targets = { chunking: chunkingOptions, convert: convertOptions };

  for (const { uiField, target, apiField } of CHUNK_FIELD_MAPPINGS) {
    if (additionalOptions[uiField] !== undefined) {
      targets[target][apiField] = additionalOptions[uiField];
    }
  }

  return {
    chunkingOptions:
      Object.keys(chunkingOptions).length > 0 ? (chunkingOptions as ChunkingOptions) : undefined,
    convertOptions:
      Object.keys(convertOptions).length > 0 ? (convertOptions as ConvertOptions) : undefined,
    includeConvertedDoc:
      (additionalOptions.includeConvertedDoc as boolean) ?? false,
  };
}

function appendChunkFormData(
  formData: FormData,
  chunkingOptions: ChunkingOptions | undefined,
  convertOptions: ConvertOptions | undefined,
  includeConvertedDoc: boolean,
): void {
  const sources: Record<string, Record<string, unknown> | undefined> = {
    chunking: chunkingOptions as Record<string, unknown> | undefined,
    convert: convertOptions as Record<string, unknown> | undefined,
  };

  for (const { target, apiField, formField } of CHUNK_FIELD_MAPPINGS) {
    const value = sources[target]?.[apiField];
    if (value !== undefined) {
      formData.append(formField, String(value));
    }
  }

  if (includeConvertedDoc) {
    formData.append("include_converted_doc", "true");
  }
}

export async function chunkFromUrl(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const sourceUrl = this.getNodeParameter("sourceUrl", itemIndex) as string;
  const chunkerType = this.getNodeParameter(
    "chunkerType",
    itemIndex,
  ) as ChunkerType;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const { chunkingOptions, convertOptions, includeConvertedDoc } =
    buildChunkOptions(additionalOptions);

  const requestBody: ChunkRequest = {
    sources: [{ kind: "http", url: sourceUrl }],
    chunking_options: chunkingOptions,
    convert_options: convertOptions,
    include_converted_doc: includeConvertedDoc,
  };

  const endpoint = getChunkEndpoint(chunkerType, false, false);

  const response = await doclingApiRequest.call(
    this,
    "POST",
    endpoint,
    requestBody as unknown as IDataObject,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

async function executeChunkFromFile(
  context: IExecuteFunctions,
  itemIndex: number,
  isAsync: boolean,
): Promise<INodeExecutionData> {
  const binaryPropertyName = context.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
  const chunkerType = context.getNodeParameter(
    "chunkerType",
    itemIndex,
  ) as ChunkerType;
  const additionalOptions = context.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const credentials = await context.getCredentials("doclingServeApi");
  const baseUrl = credentials.baseUrl as string;
  const apiKey = credentials.apiKey as string;

  const binaryData = await prepareBinaryData.call(
    context,
    itemIndex,
    binaryPropertyName,
  );
  const { chunkingOptions, convertOptions, includeConvertedDoc } =
    buildChunkOptions(additionalOptions);

  const formData = new FormData();
  const blob = new Blob([Buffer.from(binaryData.base64, "base64")], {
    type: binaryData.mimeType,
  });
  formData.append("files", blob, binaryData.filename);

  appendChunkFormData(formData, chunkingOptions, convertOptions, includeConvertedDoc);

  const endpoint = getChunkEndpoint(chunkerType, true, isAsync);

  const response = await context.helpers.httpRequest({
    method: "POST",
    url: `${baseUrl}${endpoint}`,
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: formData,
  });

  if (!isAsync) {
    return {
      json: response as IDataObject,
      pairedItem: itemIndex,
    };
  }

  const taskResponse = response as TaskStatusResponse;
  const status = await pollUntilComplete.call(context, taskResponse.task_id);

  if (status.task_status === "failure") {
    throw new Error(`Chunk task failed: ${taskResponse.task_id}`);
  }

  const result = await getTaskResult.call(context, taskResponse.task_id);

  return {
    json: result as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function chunkFromFile(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  return executeChunkFromFile(this, itemIndex, false);
}

export async function chunkFromUrlAsync(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const sourceUrl = this.getNodeParameter("sourceUrl", itemIndex) as string;
  const chunkerType = this.getNodeParameter(
    "chunkerType",
    itemIndex,
  ) as ChunkerType;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const { chunkingOptions, convertOptions, includeConvertedDoc } =
    buildChunkOptions(additionalOptions);

  const requestBody: ChunkRequest = {
    sources: [{ kind: "http", url: sourceUrl }],
    chunking_options: chunkingOptions,
    convert_options: convertOptions,
    include_converted_doc: includeConvertedDoc,
  };

  const endpoint = getChunkEndpoint(chunkerType, false, true);

  const taskResponse = (await doclingApiRequest.call(
    this,
    "POST",
    endpoint,
    requestBody as unknown as IDataObject,
  )) as TaskStatusResponse;

  const status = await pollUntilComplete.call(this, taskResponse.task_id);

  if (status.task_status === "failure") {
    throw new Error(`Chunk task failed: ${taskResponse.task_id}`);
  }

  const result = await getTaskResult.call(this, taskResponse.task_id);

  return {
    json: result as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function chunkFromFileAsync(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  return executeChunkFromFile(this, itemIndex, true);
}
