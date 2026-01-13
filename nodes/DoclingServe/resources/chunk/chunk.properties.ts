/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import type { INodeProperties } from "n8n-workflow";
import { CHUNKER_TYPES } from "@docling/constants/chunkers";

// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
export const chunkerTypeProperty: INodeProperties = {
  displayName: "Chunker Type",
  name: "chunkerType",
  type: "options",
  options: [
    {
      name: "Hybrid",
      value: CHUNKER_TYPES.HYBRID,
      description: "Hybrid chunking combining multiple strategies",
    },
    {
      name: "Hierarchical",
      value: CHUNKER_TYPES.HIERARCHICAL,
      description: "Hierarchical chunking based on document structure",
    },
  ],
  default: CHUNKER_TYPES.HYBRID,
  description: "The type of chunker to use",
};

export const chunkSourceUrlProperty: INodeProperties = {
  displayName: "Source URL",
  name: "sourceUrl",
  type: "string",
  default: "",
  required: true,
  placeholder: "https://example.com/document.pdf",
  description: "URL of the document to chunk",
};

export const chunkBinaryPropertyNameProperty: INodeProperties = {
  displayName: "Input Binary Field",
  name: "binaryPropertyName",
  type: "string",
  default: "data",
  required: true,
  description: "Name of the binary property containing the file to chunk",
};

export const chunkAdditionalOptionsProperty: INodeProperties = {
  displayName: "Additional Options",
  name: "additionalOptions",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  options: [
    {
      displayName: "Max Tokens",
      name: "maxTokens",
      type: "number",
      default: 512,
      description: "Maximum number of tokens per chunk",
    },
    {
      displayName: "Merge Peers",
      name: "mergePeers",
      type: "boolean",
      default: true,
      description: "Whether to merge peer elements in chunks",
    },
    {
      displayName: "Include Converted Document",
      name: "includeConvertedDoc",
      type: "boolean",
      default: false,
      description:
        "Whether to include the full converted document in the response",
    },
    {
      displayName: "OCR Engine",
      name: "ocrEngine",
      type: "options",
      options: [
        {
          name: "EasyOCR (Default)",
          value: "easyocr",
        },
        {
          name: "Tesseract",
          value: "tesseract",
        },
      ],
      default: "easyocr",
      description: "OCR engine to use for scanned documents",
    },
  ],
};
