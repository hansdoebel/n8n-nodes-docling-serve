import {
  ApplicationError,
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
  NodeConnectionTypes,
} from "n8n-workflow";
import { documentDescription } from "./resources/document";
import {
  convertFromFile,
  convertFromFileAsync,
  convertFromUrl,
  convertFromUrlAsync,
} from "./resources/document/document.operations";
import { chunkDescription } from "./resources/chunk";
import {
  chunkFromFile,
  chunkFromFileAsync,
  chunkFromUrl,
  chunkFromUrlAsync,
} from "./resources/chunk/chunk.operations";
import { taskDescription } from "./resources/task";
import {
  getResult,
  getStatus,
} from "./resources/task/task.operations";
import { systemDescription } from "./resources/system";
import {
  healthCheck,
  readinessCheck,
  getVersion,
  clearConverters,
  clearResults,
  memoryStats,
  memoryCounts,
} from "./resources/system/system.operations";
import { OPERATIONS, RESOURCES } from "./constants";

export class DoclingServe implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Docling Serve",
    name: "doclingServe",
    icon: "file:../../icons/docling-serve.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Convert documents using Docling Serve API",
    defaults: {
      name: "Docling Serve",
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "doclingServeApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Document",
            value: "document",
          },
          {
            name: "Chunk",
            value: "chunk",
          },
          {
            name: "Task",
            value: "task",
          },
          {
            name: "System",
            value: "system",
          },
        ],
        default: "document",
      },
      ...documentDescription,
      ...chunkDescription,
      ...taskDescription,
      ...systemDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData;

        if (resource === RESOURCES.DOCUMENT) {
          switch (operation) {
            case OPERATIONS.DOCUMENT.CONVERT_FROM_URL:
              result = await convertFromUrl.call(this, i);
              break;
            case OPERATIONS.DOCUMENT.CONVERT_FROM_FILE:
              result = await convertFromFile.call(this, i);
              break;
            case OPERATIONS.DOCUMENT.CONVERT_FROM_URL_ASYNC:
              result = await convertFromUrlAsync.call(this, i);
              break;
            case OPERATIONS.DOCUMENT.CONVERT_FROM_FILE_ASYNC:
              result = await convertFromFileAsync.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown document operation: ${operation}`,
              );
          }
        } else if (resource === RESOURCES.CHUNK) {
          switch (operation) {
            case OPERATIONS.CHUNK.CHUNK_FROM_URL:
              result = await chunkFromUrl.call(this, i);
              break;
            case OPERATIONS.CHUNK.CHUNK_FROM_FILE:
              result = await chunkFromFile.call(this, i);
              break;
            case OPERATIONS.CHUNK.CHUNK_FROM_URL_ASYNC:
              result = await chunkFromUrlAsync.call(this, i);
              break;
            case OPERATIONS.CHUNK.CHUNK_FROM_FILE_ASYNC:
              result = await chunkFromFileAsync.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown chunk operation: ${operation}`,
              );
          }
        } else if (resource === RESOURCES.TASK) {
          switch (operation) {
            case OPERATIONS.TASK.GET_STATUS:
              result = await getStatus.call(this, i);
              break;
            case OPERATIONS.TASK.GET_RESULT:
              result = await getResult.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown task operation: ${operation}`,
              );
          }
        } else if (resource === RESOURCES.SYSTEM) {
          switch (operation) {
            case OPERATIONS.SYSTEM.HEALTH_CHECK:
              result = await healthCheck.call(this, i);
              break;
            case OPERATIONS.SYSTEM.READINESS_CHECK:
              result = await readinessCheck.call(this, i);
              break;
            case OPERATIONS.SYSTEM.GET_VERSION:
              result = await getVersion.call(this, i);
              break;
            case OPERATIONS.SYSTEM.CLEAR_CONVERTERS:
              result = await clearConverters.call(this, i);
              break;
            case OPERATIONS.SYSTEM.CLEAR_RESULTS:
              result = await clearResults.call(this, i);
              break;
            case OPERATIONS.SYSTEM.MEMORY_STATS:
              result = await memoryStats.call(this, i);
              break;
            case OPERATIONS.SYSTEM.MEMORY_COUNTS:
              result = await memoryCounts.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown system operation: ${operation}`,
              );
          }
        } else {
          throw new ApplicationError(`Unknown resource: ${resource}`);
        }

        returnData.push(result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: i,
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
