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
  getResult,
  getStatus,
} from "./resources/document/document.operations";
import { chunkDescription } from "./resources/chunk";
import {
  chunkFromFile,
  chunkFromUrl,
} from "./resources/chunk/chunk.operations";
import { systemDescription } from "./resources/system";
import { healthCheck } from "./resources/system/system.operations";

export class DoclingServe implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Docling Serve",
    name: "doclingServe",
    // eslint-disable-next-line @n8n/community-nodes/icon-validation
    icon: "file:docling-serve.svg",
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
            name: "System",
            value: "system",
          },
        ],
        default: "document",
      },
      ...documentDescription,
      ...chunkDescription,
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

        if (resource === "document") {
          switch (operation) {
            case "convertFromUrl":
              result = await convertFromUrl.call(this, i);
              break;
            case "convertFromFile":
              result = await convertFromFile.call(this, i);
              break;
            case "convertFromUrlAsync":
              result = await convertFromUrlAsync.call(this, i);
              break;
            case "convertFromFileAsync":
              result = await convertFromFileAsync.call(this, i);
              break;
            case "getStatus":
              result = await getStatus.call(this, i);
              break;
            case "getResult":
              result = await getResult.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown document operation: ${operation}`,
              );
          }
        } else if (resource === "chunk") {
          switch (operation) {
            case "chunkFromUrl":
              result = await chunkFromUrl.call(this, i);
              break;
            case "chunkFromFile":
              result = await chunkFromFile.call(this, i);
              break;
            default:
              throw new ApplicationError(
                `Unknown chunk operation: ${operation}`,
              );
          }
        } else if (resource === "system") {
          switch (operation) {
            case "healthCheck":
              result = await healthCheck.call(this, i);
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
