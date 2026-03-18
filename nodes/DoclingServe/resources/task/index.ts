import type { INodeProperties } from "n8n-workflow";
import { taskIdProperty } from "./task.properties";

const showOnlyForTask = {
  resource: ["task"],
};

export const taskDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForTask,
    },
    options: [
      {
        name: "Get Status",
        value: "getStatus",
        action: "Get task status",
        description: "Get the status of an async task",
      },
      {
        name: "Get Result",
        value: "getResult",
        action: "Get task result",
        description: "Get the result of a completed async task",
      },
    ],
    default: "getStatus",
  },
  {
    ...taskIdProperty,
    displayOptions: {
      show: showOnlyForTask,
    },
  },
];

export * from "./task.operations";
