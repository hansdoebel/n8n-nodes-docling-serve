import type { INodeProperties } from "n8n-workflow";
import {
  additionalOptionsProperty,
  binaryPropertyNameProperty,
  sourceUrlProperty,
} from "./document.properties";

const showOnlyForDocument = {
  resource: ["document"],
};

const showForConvertUrl = {
  resource: ["document"],
  operation: ["convertFromUrl", "convertFromUrlAsync"],
};

const showForConvertFile = {
  resource: ["document"],
  operation: ["convertFromFile", "convertFromFileAsync"],
};

const showForConvertOperations = {
  resource: ["document"],
  operation: [
    "convertFromUrl",
    "convertFromFile",
    "convertFromUrlAsync",
    "convertFromFileAsync",
  ],
};

export const documentDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForDocument,
    },
    options: [
      {
        name: "Convert From File",
        value: "convertFromFile",
        action: "Convert a document from file",
        description: "Convert a document from binary data",
      },
      {
        name: "Convert From File (Async)",
        value: "convertFromFileAsync",
        action: "Convert a document from file asynchronously",
        description: "Convert a document from file with auto-polling",
      },
      {
        name: "Convert From URL",
        value: "convertFromUrl",
        action: "Convert a document from URL",
        description: "Convert a document from an HTTP URL",
      },
      {
        name: "Convert From URL (Async)",
        value: "convertFromUrlAsync",
        action: "Convert a document from URL asynchronously",
        description: "Convert a document from URL with auto-polling",
      },
    ],
    default: "convertFromUrl",
  },
  {
    ...sourceUrlProperty,
    displayOptions: {
      show: showForConvertUrl,
    },
  },
  {
    ...binaryPropertyNameProperty,
    displayOptions: {
      show: showForConvertFile,
    },
  },
  {
    ...additionalOptionsProperty,
    displayOptions: {
      show: showForConvertOperations,
    },
  },
];

export * from "./document.operations";
