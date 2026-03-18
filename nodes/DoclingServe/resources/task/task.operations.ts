import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { ENDPOINTS } from "../../constants";
import { doclingApiRequest } from "../../helpers/api";
import { getTaskResult as getTaskResultHelper } from "../../helpers/polling";

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

  const response = await getTaskResultHelper.call(this, taskId);

  return {
    json: response as IDataObject,
    pairedItem: itemIndex,
  };
}
