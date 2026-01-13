/* eslint-disable @n8n/community-nodes/no-restricted-imports, @n8n/community-nodes/no-restricted-globals */
import type { IExecuteFunctions } from "n8n-workflow";
import type { TaskStatusResponse } from "@docling/types/responses";
import { ENDPOINTS } from "@docling/constants/endpoints";
import { doclingApiRequest } from "./api";

const COMPLETED_STATUSES = ["success", "failure"];
const DEFAULT_MAX_ATTEMPTS = 60;
const DEFAULT_INTERVAL_MS = 2000;

export async function pollUntilComplete(
  this: IExecuteFunctions,
  taskId: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  intervalMs = DEFAULT_INTERVAL_MS,
): Promise<TaskStatusResponse> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = (await doclingApiRequest.call(
      this,
      "GET",
      `${ENDPOINTS.STATUS_POLL}/${taskId}`,
    )) as TaskStatusResponse;

    if (COMPLETED_STATUSES.includes(status.task_status)) {
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
