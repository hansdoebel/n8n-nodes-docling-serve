import type { INodeProperties } from "n8n-workflow";
import { CHUNKER_TYPES } from "../../constants";

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
  placeholder: "e.g. data",
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
      displayName: "Do OCR",
      name: "doOcr",
      type: "boolean",
      default: true,
      description: "Whether to process bitmap content using OCR",
    },
    {
      displayName: "Do Table Structure",
      name: "doTableStructure",
      type: "boolean",
      default: true,
      description: "Whether to extract table structure from the document",
    },
    {
      displayName: "Document Timeout",
      name: "documentTimeout",
      type: "number",
      default: 604800,
      placeholder: "e.g. 604800",
      description: "Maximum time in seconds to process the document",
    },
    {
      displayName: "Force OCR",
      name: "forceOcr",
      type: "boolean",
      default: false,
      description:
        "Whether to replace existing text with OCR-generated text over content",
    },
    {
      displayName: "Image Export Mode",
      name: "imageExportMode",
      type: "options",
      options: [
        {
          name: "Embedded",
          value: "embedded",
          description: "Embed images directly in the output",
        },
        {
          name: "Placeholder",
          value: "placeholder",
          description: "Replace images with placeholders",
        },
        {
          name: "Referenced",
          value: "referenced",
          description: "Reference images by URL",
        },
      ],
      default: "embedded",
      description:
        "Image export mode for the document (in case of JSON, Markdown or HTML)",
    },
    {
      displayName: "Images Scale",
      name: "imagesScale",
      type: "number",
      default: 2.0,
      placeholder: "e.g. 2.0",
      description: "Scale factor for extracted images",
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
      displayName: "Include Images",
      name: "includeImages",
      type: "boolean",
      default: true,
      description: "Whether to extract images from the document",
    },
    {
      displayName: "Include Raw Text",
      name: "includeRawText",
      type: "boolean",
      default: false,
      description:
        "Whether to include both raw_text and contextualized text in the response",
    },
    {
      displayName: "Max Tokens",
      name: "maxTokens",
      type: "number",
      default: 512,
      placeholder: "e.g. 512",
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
    {
      displayName: "Pipeline",
      name: "pipeline",
      type: "options",
      options: [
        {
          name: "Standard (Default)",
          value: "standard",
        },
        {
          name: "VLM",
          value: "vlm",
        },
        {
          name: "ASR",
          value: "asr",
        },
        {
          name: "Legacy",
          value: "legacy",
        },
      ],
      default: "standard",
      description: "The processing pipeline to use for PDF or image files",
    },
    {
      displayName: "Table Mode",
      name: "tableMode",
      type: "options",
      options: [
        {
          name: "Accurate (Default)",
          value: "accurate",
        },
        {
          name: "Fast",
          value: "fast",
        },
      ],
      default: "accurate",
      description: "Mode to use for table structure extraction",
    },
    {
      displayName: "Tokenizer",
      name: "tokenizer",
      type: "string",
      default: "sentence-transformers/all-MiniLM-L6-v2",
      placeholder: "e.g. sentence-transformers/all-MiniLM-L6-v2",
      description: "HuggingFace model name used for tokenization (Hybrid chunker only)",
      displayOptions: {
        show: {
          "/chunkerType": ["hybrid"],
        },
      },
    },
    {
      displayName: "Use Markdown Tables",
      name: "useMarkdownTables",
      type: "boolean",
      default: false,
      description:
        "Whether to use markdown table format instead of triplets for table serialization",
    },
  ],
};
