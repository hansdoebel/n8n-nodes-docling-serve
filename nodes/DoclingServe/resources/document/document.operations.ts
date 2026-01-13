/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS } from "@docling/constants/endpoints";
import { doclingApiRequest } from "@docling/helpers/api";
import { prepareBinaryData } from "@docling/helpers/binary";
import { getTaskResult, pollUntilComplete } from "@docling/helpers/polling";
import type { TaskStatusResponse } from "@docling/types/responses";
import type {
  ConvertOptions,
  ConvertSourceRequest,
} from "@docling/types/requests";

function buildConvertOptions(
  additionalOptions: IDataObject,
): ConvertOptions | undefined {
  const options: ConvertOptions = {};

  if (additionalOptions.ocrEngine) {
    options.ocr_engine = additionalOptions.ocrEngine as string;
  }

  if (additionalOptions.documentTimeout) {
    options.document_timeout = additionalOptions.documentTimeout as number;
  }

  return Object.keys(options).length > 0 ? options : undefined;
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

  if (additionalOptions.ocrEngine) {
    formData.append("ocr_engine", additionalOptions.ocrEngine as string);
  }
  if (additionalOptions.documentTimeout) {
    formData.append(
      "document_timeout",
      String(additionalOptions.documentTimeout),
    );
  }

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

  if (additionalOptions.ocrEngine) {
    formData.append("ocr_engine", additionalOptions.ocrEngine as string);
  }
  if (additionalOptions.documentTimeout) {
    formData.append(
      "document_timeout",
      String(additionalOptions.documentTimeout),
    );
  }

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

export async function getStatus(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const taskId = this.getNodeParameter("taskId", itemIndex) as string;

  const response = await doclingApiRequest.call(
    this,
    "GET",
    `${ENDPOINTS.STATUS_POLL}/${taskId}`,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function getResult(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const taskId = this.getNodeParameter("taskId", itemIndex) as string;

  const response = await getTaskResult.call(this, taskId);

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}
