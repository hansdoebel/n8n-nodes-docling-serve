import type { INodeProperties } from "n8n-workflow";
import {
  OCR_ENGINES,
  PIPELINES,
  PDF_BACKENDS,
  IMAGE_EXPORT_MODES,
  TABLE_MODES,
  INPUT_FORMATS,
  API_OUTPUT_FORMATS,
  OUTPUT_FORMATS,
} from "../../constants";

export const sourceUrlProperty: INodeProperties = {
  displayName: "Source URL",
  name: "sourceUrl",
  type: "string",
  default: "",
  required: true,
  placeholder: "https://example.com/document.pdf",
  description: "URL of the document to convert",
};

export const binaryPropertyNameProperty: INodeProperties = {
  displayName: "Input Binary Field",
  name: "binaryPropertyName",
  type: "string",
  default: "data",
  required: true,
  placeholder: "e.g. data",
  description: "Name of the binary property containing the file to convert",
};

export const outputFormatProperty: INodeProperties = {
  displayName: "Output Format",
  name: "outputFormat",
  type: "options",
  options: [
    {
      name: "Markdown",
      value: OUTPUT_FORMATS.MARKDOWN,
    },
    {
      name: "HTML",
      value: OUTPUT_FORMATS.HTML,
    },
    {
      name: "JSON",
      value: OUTPUT_FORMATS.JSON,
    },
    {
      name: "DocTags",
      value: OUTPUT_FORMATS.DOCTAGS,
    },
  ],
  default: OUTPUT_FORMATS.MARKDOWN,
  description: "The format to convert the document to",
};

export const additionalOptionsProperty: INodeProperties = {
  displayName: "Additional Options",
  name: "additionalOptions",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  options: [
    {
      displayName: "Abort on Error",
      name: "abortOnError",
      type: "boolean",
      default: false,
      description:
        "Whether to abort processing on error rather than continuing",
    },
    {
      displayName: "Code/Formula Preset",
      name: "codeFormulaPreset",
      type: "string",
      default: "",
      placeholder: "e.g. my-preset",
      description: "Preset name for code and formula enrichment model",
    },
    {
      displayName: "Do Chart Extraction",
      name: "doChartExtraction",
      type: "boolean",
      default: false,
      description: "Whether to extract charts from the document",
    },
    {
      displayName: "Do Code Enrichment",
      name: "doCodeEnrichment",
      type: "boolean",
      default: false,
      description: "Whether to enrich code blocks in the document",
    },
    {
      displayName: "Do Formula Enrichment",
      name: "doFormulaEnrichment",
      type: "boolean",
      default: false,
      description: "Whether to enrich mathematical formulas",
    },
    {
      displayName: "Do OCR",
      name: "doOcr",
      type: "boolean",
      default: true,
      description: "Whether to process bitmap content using OCR",
    },
    {
      displayName: "Do Picture Classification",
      name: "doPictureClassification",
      type: "boolean",
      default: false,
      description: "Whether to classify pictures in the document",
    },
    {
      displayName: "Do Picture Description",
      name: "doPictureDescription",
      type: "boolean",
      default: false,
      description: "Whether to generate descriptions for pictures",
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
      default: 300,
      placeholder: "e.g. 300",
      description: "Maximum time in seconds to process the document",
    },
    {
      displayName: "Force OCR",
      name: "forceOcr",
      type: "boolean",
      default: false,
      description:
        "Whether to replace existing text with OCR-generated text",
    },
    {
      displayName: "From Formats",
      name: "fromFormats",
      type: "multiOptions",
      options: Object.entries(INPUT_FORMATS).map(([key, value]) => ({
        name: key.replace(/_/g, " "),
        value,
      })),
      default: [],
      description: "Restrict which input formats to accept. Leave empty to accept all.",
    },
        {
      displayName: "Image Export Mode",
      name: "imageExportMode",
      type: "options",
      options: [
        {
          name: "Embedded",
          value: IMAGE_EXPORT_MODES.EMBEDDED,
          description: "Embed images directly in the output",
        },
        {
          name: "Placeholder",
          value: IMAGE_EXPORT_MODES.PLACEHOLDER,
          description: "Replace images with placeholders",
        },
        {
          name: "Referenced",
          value: IMAGE_EXPORT_MODES.REFERENCED,
          description: "Reference images by URL",
        },
      ],
      default: IMAGE_EXPORT_MODES.EMBEDDED,
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
      typeOptions: {
        minValue: 0.1,
        maxValue: 10.0,
      },
    },
    {
      displayName: "Include Images",
      name: "includeImages",
      type: "boolean",
      default: true,
      description: "Whether to extract images from the document",
    },
    {
      displayName: "Markdown Page Break",
      name: "mdPageBreakPlaceholder",
      type: "string",
      default: "",
      placeholder: "e.g. <!-- page break -->",
      description: "Placeholder string for page breaks in Markdown output",
    },
        {
      displayName: "OCR Engine",
      name: "ocrEngine",
      type: "options",
      options: [
        {
          name: "Auto",
          value: OCR_ENGINES.AUTO,
        },
        {
          name: "EasyOCR",
          value: OCR_ENGINES.EASYOCR,
        },
        {
          name: "OCRmac",
          value: OCR_ENGINES.OCRMAC,
        },
        {
          name: "RapidOCR",
          value: OCR_ENGINES.RAPIDOCR,
        },
        {
          name: "TesserOCR",
          value: OCR_ENGINES.TESSEROCR,
        },
        {
          name: "Tesseract",
          value: OCR_ENGINES.TESSERACT,
        },
      ],
      default: OCR_ENGINES.AUTO,
      description: "OCR engine to use for scanned documents",
    },
    {
      displayName: "OCR Languages",
      name: "ocrLang",
      type: "string",
      default: "",
      placeholder: "e.g. en,de,fr",
      description:
        "Comma-separated list of OCR language codes",
    },
    {
      displayName: "Page Range End",
      name: "pageRangeEnd",
      type: "number",
      default: 0,
      description: "Last page to process (0-indexed). Used with Page Range Start.",
    },
    {
      displayName: "Page Range Start",
      name: "pageRangeStart",
      type: "number",
      default: 0,
      description: "First page to process (0-indexed). Used with Page Range End.",
    },
        {
      displayName: "PDF Backend",
      name: "pdfBackend",
      type: "options",
      options: [
        {
          name: "Dlparse V4 (Default)",
          value: PDF_BACKENDS.DLPARSE_V4,
        },
        {
          name: "Dlparse V2",
          value: PDF_BACKENDS.DLPARSE_V2,
        },
        {
          name: "Dlparse V1",
          value: PDF_BACKENDS.DLPARSE_V1,
        },
        {
          name: "Docling Parse",
          value: PDF_BACKENDS.DOCLING_PARSE,
        },
        {
          name: "Pypdfium2",
          value: PDF_BACKENDS.PYPDFIUM2,
        },
      ],
      default: PDF_BACKENDS.DLPARSE_V4,
      description: "PDF parsing backend to use",
    },
    {
      displayName: "Picture Description Area Threshold",
      name: "pictureDescriptionAreaThreshold",
      type: "number",
      default: 0.05,
      description: "Minimum area ratio for picture description",
      typeOptions: {
        minValue: 0,
        maxValue: 1,
        numberPrecision: 2,
      },
    },
    {
      displayName: "Picture Description Preset",
      name: "pictureDescriptionPreset",
      type: "string",
      default: "",
      placeholder: "e.g. my-preset",
      description: "Preset name for picture description model",
    },
        {
      displayName: "Pipeline",
      name: "pipeline",
      type: "options",
      options: [
        {
          name: "Standard (Default)",
          value: PIPELINES.STANDARD,
        },
        {
          name: "VLM",
          value: PIPELINES.VLM,
        },
        {
          name: "ASR",
          value: PIPELINES.ASR,
        },
        {
          name: "Legacy",
          value: PIPELINES.LEGACY,
        },
      ],
      default: PIPELINES.STANDARD,
      description: "The processing pipeline to use for PDF or image files",
    },
    {
      displayName: "Table Cell Matching",
      name: "tableCellMatching",
      type: "boolean",
      default: true,
      description: "Whether to match table cells to structure",
    },
        {
      displayName: "Table Mode",
      name: "tableMode",
      type: "options",
      options: [
        {
          name: "Accurate (Default)",
          value: TABLE_MODES.ACCURATE,
        },
        {
          name: "Fast",
          value: TABLE_MODES.FAST,
        },
      ],
      default: TABLE_MODES.ACCURATE,
      description: "Mode to use for table structure extraction",
    },
    {
      displayName: "To Formats",
      name: "toFormats",
      type: "multiOptions",
      options: Object.entries(API_OUTPUT_FORMATS).map(([key, value]) => ({
        name: key.replace(/_/g, " "),
        value,
      })),
      default: [],
      description: "Output formats to generate. Leave empty for default.",
    },
    {
      displayName: "VLM Pipeline Preset",
      name: "vlmPipelinePreset",
      type: "string",
      default: "",
      placeholder: "e.g. my-preset",
      description: "Preset name for the VLM pipeline model",
    },
  ],
};
