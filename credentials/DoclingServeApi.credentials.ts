import type { Icon, ICredentialType, INodeProperties } from "n8n-workflow";

// eslint-disable-next-line @n8n/community-nodes/credential-test-required
export class DoclingServeApi implements ICredentialType {
  name = "doclingServeApi";
  displayName = "Docling Serve API";

  testedBy = "doclingServe";
  documentationUrl = "https://github.com/docling-project/docling-serve";
  // eslint-disable-next-line @n8n/community-nodes/icon-validation
  icon: Icon = "file:docling-serve.svg";
  properties: INodeProperties[] = [
    {
      displayName: "Base URL",
      name: "baseUrl",
      type: "string",
      default: "http://127.0.0.1:5001",
      required: true,
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
      description:
        "API key for authentication (optional, depends on server configuration)",
    },
  ];
}
