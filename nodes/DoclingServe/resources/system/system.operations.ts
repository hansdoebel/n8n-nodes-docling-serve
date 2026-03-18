/* eslint-disable @n8n/community-nodes/no-restricted-imports */
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
