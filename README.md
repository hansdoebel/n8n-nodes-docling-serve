# n8n-nodes-docling-serve

n8n community node for integrating Docling Serve document conversion API with your workflows.

## Table of Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Compatibility](#compatibility)
- [Development Notes](#development-notes)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-docling-serve` in the **npm Package Name** field
4. Agree to the risks of using community nodes
5. Select **Install**

## Credentials

### Docling Serve API

1. Deploy a Docling Serve instance (see [Docling Serve documentation](https://github.com/docling-project/docling-serve))
2. In n8n: Create new credential > **Docling Serve API**
3. Enter the **Base URL** of your Docling Serve instance (default: `http://127.0.0.1:5001`)
4. Optionally enter an **API Key** if your server requires authentication
5. Save

## Operations

### Document

| Operation | Description |
|-----------|-------------|
| Convert from URL | Convert a document from a URL (synchronous) |
| Convert from File | Convert a document from binary data (synchronous) |
| Convert from URL (Async) | Start async conversion from a URL |
| Convert from File (Async) | Start async conversion from binary data |
| Get Status | Get the status of an async conversion task |
| Get Result | Get the result of a completed async conversion |

### Chunk

| Operation | Description |
|-----------|-------------|
| Chunk from URL | Chunk a document from a URL |
| Chunk from File | Chunk a document from binary data |

### System

| Operation | Description |
|-----------|-------------|
| Health Check | Check the health status of the Docling Serve instance |

## Compatibility

Tested with:

- n8n Version: 2.2.3
- Node Version: 22.11.0

## Development Notes

### Kill n8n Process

Add this alias to your `~/.zshrc` for quick n8n process termination during development:

```bash
alias kill-n8n="kill -9 \$(lsof -ti tcp:5678 -sTCP:LISTEN)"
```

After adding, reload your shell: `source ~/.zshrc`

### Publish New Release

```
# Bump the version
npm version patch|minor|major
```

```
# push the tag to GitHub
git push origin v1.2.3
```

## Resources

- [n8n Website](https://n8n.io/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Documentation for LLMs](https://docs.n8n.io/llms.txt)

- [Docling Project Website](https://docling-project.github.io/docling/)
- [Docling Serve GitHub](https://github.com/docling-project/docling-serve)
- [Docling GitHub](https://github.com/DS4SD/docling)

- [GitHub Repository](https://github.com/hansdoebel/n8n-nodes-docling-serve)
- [@n8n/node-cli README](https://raw.githubusercontent.com/n8n-io/n8n/refs/heads/master/packages/%40n8n/node-cli/README.md)

## Version History

- `0.0.1` - Initial release
