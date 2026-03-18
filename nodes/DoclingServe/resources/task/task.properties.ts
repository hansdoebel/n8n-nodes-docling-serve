import type { INodeProperties } from "n8n-workflow";

export const taskIdProperty: INodeProperties = {
  displayName: "Task ID",
  name: "taskId",
  type: "string",
  default: "",
  required: true,
  placeholder: "e.g. abc123-def456-ghi789",
  description: "ID of the async task to check or retrieve",
};
