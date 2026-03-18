import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS } from "../../constants";
import { doclingApiRequest } from "../../helpers/api";

export async function healthCheck(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(this, "GET", ENDPOINTS.HEALTH);

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function readinessCheck(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(this, "GET", ENDPOINTS.READY);

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function getVersion(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(this, "GET", ENDPOINTS.VERSION);

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function clearConverters(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(
    this,
    "GET",
    ENDPOINTS.CLEAR_CONVERTERS,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function clearResults(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const olderThan = this.getNodeParameter("olderThan", itemIndex) as number;
  const qs: IDataObject = { older_then: olderThan };
  const response = await doclingApiRequest.call(
    this,
    "GET",
    ENDPOINTS.CLEAR_RESULTS,
    undefined,
    qs,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function memoryStats(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(
    this,
    "GET",
    ENDPOINTS.MEMORY_STATS,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}

export async function memoryCounts(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData> {
  const response = await doclingApiRequest.call(
    this,
    "GET",
    ENDPOINTS.MEMORY_COUNTS,
  );

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}
