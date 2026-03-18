<h1 align="center">
  <br>
  n8n-nodes-docling-serve
  <br>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-docling-serve"><img src="https://img.shields.io/npm/v/n8n-nodes-docling-serve.svg" alt="NPM Version"></a>
  <a href="https://github.com/hansdoebel/n8n-nodes-docling-serve/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/hansdoebel/n8n-nodes-docling-serve" alt="GitHub License"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-docling-serve"><img src="https://img.shields.io/npm/dt/n8n-nodes-docling-serve.svg" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-docling-serve"><img src="https://img.shields.io/npm/last-update/n8n-nodes-docling-serve" alt="NPM Last Update"></a>
  <img src="https://img.shields.io/badge/n8n-2.11.4-blue" alt="n8n 2.11.4">
</p>

<p align="center">
  <a href="#installation">Installation</a> |
  <a href="#credentials">Credentials</a> |
  <a href="#resources">Resources</a> |
  <a href="#development">Development</a> |
  <a href="#license">License</a>
</p>

---

An n8n community node for integrating [Docling Serve](https://github.com/docling-project/docling-serve) document conversion API with your workflows.

## Installation

1. Create a new workflow or open an existing one
2. Open the nodes panel by selecting **+** or pressing **N**
3. Search for **Docling Serve**
4. Select **Install** to install the node for your instance

OR

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-docling-serve` in the **npm Package Name** field
4. Agree to the risks of using community nodes
5. Select **Install**

## Credentials

1. Deploy a [Docling Serve](https://github.com/docling-project/docling-serve) instance
2. In n8n, create a new **Docling Serve API** credential
3. Enter the **Base URL** of your Docling Serve instance (default: `http://127.0.0.1:5001`)
4. Optionally enter an **API Key** if your server requires authentication
5. Save the credential

## Resources

<details>
<summary><strong>Document</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Convert from URL | Convert a document from a URL (synchronous) |
| Convert from File | Convert a document from binary data (synchronous) |
| Convert from URL (Async) | Start async conversion from a URL |
| Convert from File (Async) | Start async conversion from binary data |
| Get Status | Get the status of an async conversion task |
| Get Result | Get the result of a completed async conversion |

</details>

<details>
<summary><strong>Chunk</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Chunk from URL | Chunk a document from a URL |
| Chunk from File | Chunk a document from binary data |

</details>

<details>
<summary><strong>System</strong></summary>

| Operation | Description |
| --------- | ----------- |
| Health Check | Check the health status of the Docling Serve instance |

</details>

## Development

```bash
git clone https://github.com/hansdoebel/n8n-nodes-docling-serve.git
cd n8n-nodes-docling-serve
npm install
npm run build
npm run lint
```

## Early Development Notice

This node is in an **early development stage**. Not all functions have been fully tested yet. If you encounter any issues, please [open an issue](https://github.com/hansdoebel/n8n-nodes-docling-serve/issues) on GitHub.

## AI Disclosure

This project was developed with the assistance of AI. The following tools were used during development:

- **[Claude Code](https://claude.com/claude-code)** (Anthropic) — Claude Opus 4.6 was used for code generation, refactoring, and documentation.

All AI-generated code has been reviewed and validated by the maintainer.

## License

[MIT](LICENSE.md)

<p align="center">
  <a href="https://github.com/hansdoebel/n8n-nodes-docling-serve">GitHub</a> |
  <a href="https://github.com/hansdoebel/n8n-nodes-docling-serve/issues">Issues</a> |
  <a href="https://github.com/docling-project/docling-serve">Docling Serve Docs</a>
</p>
