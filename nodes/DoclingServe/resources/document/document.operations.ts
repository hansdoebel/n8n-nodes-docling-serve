import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS } from "../../constants";
import { doclingApiRequest } from "../../helpers/api";
import { prepareBinaryData } from "../../helpers/binary";
import { getTaskResult, pollUntilComplete } from "../../helpers/polling";
import type { TaskStatusResponse } from "../../types/responses";
import type {
  ConvertOptions,
  ConvertSourceRequest,
} from "../../types/requests";

const DOCUMENT_FIELD_MAPPINGS = [
  { uiField: "ocrEngine", apiField: "ocr_engine", formField: "ocr_engine" },
  { uiField: "documentTimeout", apiField: "document_timeout", formField: "document_timeout" },
  { uiField: "doOcr", apiField: "do_ocr", formField: "do_ocr" },
  { uiField: "forceOcr", apiField: "force_ocr", formField: "force_ocr" },
  { uiField: "doTableStructure", apiField: "do_table_structure", formField: "do_table_structure" },
  { uiField: "includeImages", apiField: "include_images", formField: "include_images" },
  { uiField: "tableCellMatching", apiField: "table_cell_matching", formField: "table_cell_matching" },
  { uiField: "abortOnError", apiField: "abort_on_error", formField: "abort_on_error" },
  { uiField: "imageExportMode", apiField: "image_export_mode", formField: "image_export_mode" },
  { uiField: "pipeline", apiField: "pipeline", formField: "pipeline" },
  { uiField: "tableMode", apiField: "table_mode", formField: "table_mode" },
  { uiField: "pdfBackend", apiField: "pdf_backend", formField: "pdf_backend" },
  { uiField: "mdPageBreakPlaceholder", apiField: "md_page_break_placeholder", formField: "md_page_break_placeholder" },
  { uiField: "imagesScale", apiField: "images_scale", formField: "images_scale" },
  { uiField: "doCodeEnrichment", apiField: "do_code_enrichment", formField: "do_code_enrichment" },
  { uiField: "doFormulaEnrichment", apiField: "do_formula_enrichment", formField: "do_formula_enrichment" },
  { uiField: "doPictureClassification", apiField: "do_picture_classification", formField: "do_picture_classification" },
  { uiField: "doChartExtraction", apiField: "do_chart_extraction", formField: "do_chart_extraction" },
  { uiField: "doPictureDescription", apiField: "do_picture_description", formField: "do_picture_description" },
  { uiField: "pictureDescriptionAreaThreshold", apiField: "picture_description_area_threshold", formField: "picture_description_area_threshold" },
  { uiField: "vlmPipelinePreset", apiField: "vlm_pipeline_preset", formField: "vlm_pipeline_preset" },
  { uiField: "pictureDescriptionPreset", apiField: "picture_description_preset", formField: "picture_description_preset" },
  { uiField: "codeFormulaPreset", apiField: "code_formula_preset", formField: "code_formula_preset" },
] as const;

function buildConvertOptions(
  additionalOptions: IDataObject,
): ConvertOptions | undefined {
  const options: Record<string, unknown> = {};

  for (const { uiField, apiField } of DOCUMENT_FIELD_MAPPINGS) {
    if (additionalOptions[uiField] !== undefined) {
      options[apiField] = additionalOptions[uiField];
    }
  }

  // Array fields with special handling
  if (additionalOptions.ocrLang) {
    const langStr = additionalOptions.ocrLang as string;
    const langs = langStr.split(",").map((s) => s.trim()).filter(Boolean);
    if (langs.length > 0) {
      options.ocr_lang = langs;
    }
  }
  if (additionalOptions.fromFormats) {
    const formats = additionalOptions.fromFormats as string[];
    if (formats.length > 0) {
      options.from_formats = formats;
    }
  }
  if (additionalOptions.toFormats) {
    const formats = additionalOptions.toFormats as string[];
    if (formats.length > 0) {
      options.to_formats = formats;
    }
  }
  if (
    additionalOptions.pageRangeStart !== undefined &&
    additionalOptions.pageRangeEnd !== undefined
  ) {
    options.page_range = [
      additionalOptions.pageRangeStart as number,
      additionalOptions.pageRangeEnd as number,
    ];
  }

  return Object.keys(options).length > 0
    ? (options as ConvertOptions)
    : undefined;
}

function appendDocumentFormData(
  formData: FormData,
  options: ConvertOptions | undefined,
): void {
  if (!options) return;
  const record = options as Record<string, unknown>;

  for (const { apiField, formField } of DOCUMENT_FIELD_MAPPINGS) {
    const value = record[apiField];
    if (value !== undefined) {
      formData.append(formField, String(value));
    }
  }

  // Array fields
  if (options.ocr_lang) {
    for (const lang of options.ocr_lang) {
      formData.append("ocr_lang", lang);
    }
  }
  if (options.from_formats) {
    for (const fmt of options.from_formats) {
      formData.append("from_formats", fmt);
    }
  }
  if (options.to_formats) {
    for (const fmt of options.to_formats) {
      formData.append("to_formats", fmt);
    }
  }
  if (options.page_range) {
    formData.append("page_range", JSON.stringify(options.page_range));
  }
}

export async function convertFromUrl(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const sourceUrl = this.getNodeParameter("sourceUrl", itemIndex) as string;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const requestBody: ConvertSourceRequest = {
    sources: [{ kind: "http", url: sourceUrl }],
    options: buildConvertOptions(additionalOptions),
  };

  const response = await doclingApiRequest.call(
    this,
    "POST",
    ENDPOINTS.CONVERT_SOURCE,
    requestBody as unknown as IDataObject,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function convertFromFile(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
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

  const formData = new FormData();
  const blob = new Blob([Buffer.from(binaryData.base64, "base64")], {
    type: binaryData.mimeType,
  });
  formData.append("files", blob, binaryData.filename);

  const options = buildConvertOptions(additionalOptions);
  appendDocumentFormData(formData, options);

  const response = await this.helpers.httpRequest({
    method: "POST",
    url: `${baseUrl}${ENDPOINTS.CONVERT_FILE}`,
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

export async function convertFromUrlAsync(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const sourceUrl = this.getNodeParameter("sourceUrl", itemIndex) as string;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    itemIndex,
    {},
  ) as IDataObject;

  const requestBody: ConvertSourceRequest = {
    sources: [{ kind: "http", url: sourceUrl }],
    options: buildConvertOptions(additionalOptions),
  };

  const taskResponse = (await doclingApiRequest.call(
    this,
    "POST",
    ENDPOINTS.CONVERT_SOURCE_ASYNC,
    requestBody as unknown as IDataObject,
  )) as TaskStatusResponse;

  const status = await pollUntilComplete.call(this, taskResponse.task_id);

  if (status.task_status === "failure") {
    throw new Error(`Conversion task failed: ${taskResponse.task_id}`);
  }

  const result = await getTaskResult.call(this, taskResponse.task_id);

  return {
    json: result as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function convertFromFileAsync(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName",
    itemIndex,
  ) as string;
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

  const formData = new FormData();
  const blob = new Blob([Buffer.from(binaryData.base64, "base64")], {
    type: binaryData.mimeType,
  });
  formData.append("files", blob, binaryData.filename);

  const options = buildConvertOptions(additionalOptions);
  appendDocumentFormData(formData, options);

  const taskResponse = (await this.helpers.httpRequest({
    method: "POST",
    url: `${baseUrl}${ENDPOINTS.CONVERT_FILE_ASYNC}`,
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: formData,
  })) as TaskStatusResponse;

  const status = await pollUntilComplete.call(this, taskResponse.task_id);

  if (status.task_status === "failure") {
    throw new Error(`Conversion task failed: ${taskResponse.task_id}`);
  }

  const result = await getTaskResult.call(this, taskResponse.task_id);

  return {
    json: result as IDataObject,
    pairedItem: itemIndex,
  };
}
