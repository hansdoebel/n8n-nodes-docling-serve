/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS, CHUNKER_TYPES, type ChunkerType } from "../../constants";
import { doclingApiRequest } from "../../helpers/api";
import { prepareBinaryData } from "../../helpers/binary";
import type {
  ChunkingOptions,
  ChunkRequest,
  ConvertOptions,
} from "../../types/requests";

function getChunkEndpoint(chunkerType: ChunkerType, isFile: boolean): string {
  if (chunkerType === CHUNKER_TYPES.HYBRID) {
    return isFile ? ENDPOINTS.CHUNK_HYBRID_FILE : ENDPOINTS.CHUNK_HYBRID_SOURCE;
  }
  return isFile
    ? ENDPOINTS.CHUNK_HIERARCHICAL_FILE
    : ENDPOINTS.CHUNK_HIERARCHICAL_SOURCE;
}

function buildChunkOptions(additionalOptions: IDataObject): {
  chunkingOptions?: ChunkingOptions;
  convertOptions?: ConvertOptions;
  includeConvertedDoc: boolean;
} {
  const chunkingOptions: ChunkingOptions = {};
  const convertOptions: ConvertOptions = {};

  if (additionalOptions.maxTokens !== undefined) {
    chunkingOptions.max_tokens = additionalOptions.maxTokens as number;
  }

  if (additionalOptions.mergePeers !== undefined) {
    chunkingOptions.merge_peers = additionalOptions.mergePeers as boolean;
  }

  if (additionalOptions.ocrEngine) {
    convertOptions.ocr_engine = additionalOptions.ocrEngine as string;
  }

  return {
    chunkingOptions: Object.keys(chunkingOptions).length > 0
      ? chunkingOptions
      : undefined,
    convertOptions: Object.keys(convertOptions).length > 0
      ? convertOptions
      : undefined,
    includeConvertedDoc: (additionalOptions.includeConvertedDoc as boolean) ??
      false,
  };
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

  const endpoint = getChunkEndpoint(chunkerType, false);

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

export async function chunkFromFile(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
  const chunkerType = this.getNodeParameter(
    "chunkerType",
    itemIndex,
  ) as ChunkerType;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const credentials = await this.getCredentials("doclingServeApi");
  const baseUrl = credentials.baseUrl as string;
  const apiKey = credentials.apiKey as string;

  const binaryData = await prepareBinaryData.call(
    this,
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

  if (chunkingOptions?.max_tokens !== undefined) {
    formData.append("max_tokens", String(chunkingOptions.max_tokens));
  }
  if (chunkingOptions?.merge_peers !== undefined) {
    formData.append("merge_peers", String(chunkingOptions.merge_peers));
  }
  if (convertOptions?.ocr_engine) {
    formData.append("ocr_engine", convertOptions.ocr_engine);
  }
  if (includeConvertedDoc) {
    formData.append("include_converted_doc", "true");
  }

  const endpoint = getChunkEndpoint(chunkerType, true);

  const response = await this.helpers.httpRequest({
    method: "POST",
    url: `${baseUrl}${endpoint}`,
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: formData,
  });

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}
