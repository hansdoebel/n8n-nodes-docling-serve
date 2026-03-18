import type {
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class DoclingServeApi implements ICredentialType {
  name = "doclingServeApi";
  displayName = "Docling Serve API";

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/health',
      method: 'GET',
    },
  };
  documentationUrl = "https://github.com/docling-project/docling-serve";
  icon: Icon = "file:../icons/docling-serve.svg";
  properties: INodeProperties[] = [
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "http://127.0.0.1:5001",
      required: true,
      placeholder: "e.g. http://127.0.0.1:5001",
      description: "The base URL of the Docling Serve instance",
    },
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      placeholder: "e.g. sk-your-api-key",
      description:
        "API key for authentication (optional, depends on server configuration)",
    },
  ];
}
