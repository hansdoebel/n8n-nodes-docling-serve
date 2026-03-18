# Running docling-serve via Docker

This guide shows how to run a local [docling-serve](https://github.com/docling-project/docling-serve) instance using Docker, so your n8n Docling Serve node can connect to it.

## Prerequisites

- Docker (or [Colima](https://github.com/abiosoft/colima) on macOS)

### macOS with Colima

Start Colima with sufficient resources:

```bash
colima start --memory 8 --cpu 4
```

Verify Docker is working:

```bash
docker info
```

## Pull the image

```bash
docker pull quay.io/docling-project/docling-serve-cpu
```

The image is ~4.4 GB — the first pull will take a few minutes.

## Run the container

```bash
docker run -d \
  --name docling-serve \
  -p 5001:5001 \
  -e DOCLING_SERVE_ENABLE_UI=1 \
  quay.io/docling-project/docling-serve-cpu
```

| Flag | Description |
|------|-------------|
| `-d` | Run detached |
| `-p 5001:5001` | Expose API on localhost:5001 |
| `-e DOCLING_SERVE_ENABLE_UI=1` | Enable the web playground UI |

## Verify it's running

```bash
curl http://127.0.0.1:5001/health
# {"status":"ok"}
```

- API docs: http://127.0.0.1:5001/docs
- UI playground: http://127.0.0.1:5001/ui

## Connect from n8n

In your n8n Docling Serve credential, set:

- **Base URL**: `http://127.0.0.1:5001`
- **API Key**: leave empty (no auth needed locally)

## Useful commands

```bash
docker logs docling-serve        # view logs
docker stop docling-serve        # stop container
docker start docling-serve       # restart container
docker rm docling-serve          # remove container
colima stop                      # stop Colima VM (macOS only)
```
