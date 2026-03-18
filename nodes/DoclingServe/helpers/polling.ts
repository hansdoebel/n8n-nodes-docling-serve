/* eslint-disable @n8n/community-nodes/no-restricted-globals */
import type { IExecuteFunctions } from "n8n-workflow";
import type { TaskStatusResponse } from "../types/responses";
import { ENDPOINTS, POLLING } from "../constants";
import { doclingApiRequest } from "./api";

export async function pollUntilComplete(
  this: IExecuteFunctions,
  taskId: string,
  maxAttempts = POLLING.DEFAULT_MAX_ATTEMPTS,
  intervalMs = POLLING.DEFAULT_INTERVAL_MS,
): Promise<TaskStatusResponse> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = (await doclingApiRequest.call(
      this,
      "GET",
      `${ENDPOINTS.STATUS_POLL}/${taskId}`,
    )) as TaskStatusResponse;

    if ((POLLING.COMPLETED_STATUSES as readonly string[]).includes(status.task_status)) {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error(
    `Task ${taskId} did not complete within ${maxAttempts} attempts`,
  );
}

export async function getTaskResult(
  this: IExecuteFunctions,
  taskId: string,
): Promise<unknown> {
  return doclingApiRequest.call(this, "GET", `${ENDPOINTS.RESULT}/${taskId}`);
}
