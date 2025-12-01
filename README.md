# StafferFi

StafferFi is a polyglot application that combines:

- **Web UI** – Next.js 15 (TypeScript, Tailwind, etc.) under `apps/web`
- **API** – Express + DuckDB under `apps/api`
- **Lake** – Python (FastAPI/Flask-style app) served by Gunicorn under `apps/lake`

The project uses **pnpm** workspaces in development and a single **Docker image** with `supervisord` to run all three services in production-like environments.

## Demo Quick Start (local docker)

You can also run everything from the all‑in‑one image directly, if you prefer to manage Postgres yourself.

### 1. Demo Build

Install Docker
`brew install --cask docker`

Run [](./)
```bash
git clone git@github.com:eUSDSRecruiting/Michael-H-Take-Home-Assessment.git stafferfi
cd stafferfi

# Build the multi-stage Docker image
sudo docker build -t stafferfi-all .

# Create Docker network only if it does NOT exist
if ! sudo docker network ls --format '{{.Name}}' | grep -q "^stafferfi-net$"; then
  echo "Creating Docker network: stafferfi-net"
  sudo docker network create stafferfi-net
else
  echo "Docker network already exists: stafferfi-net"
fi

# Remove any existing Postgres container
sudo docker rm -f stafferfi-postgres || true

# Start Postgres
sudo docker run -d \
  --name stafferfi-postgres \
  --network stafferfi-net \
  -e POSTGRES_USER=stafferfi \
  -e POSTGRES_PASSWORD=stafferfi_dev \
  -e POSTGRES_DB=ecfr_analytics \
  -p 5432:5432 \
  postgres:16-alpine

# Start the main StafferFi container
sudo docker run --rm \
  --name stafferfi-all \
  --network stafferfi-net \
  -p 3000:3000 -p 4000:4000 -p 8000:8000 \
  -e DATABASE_URL='postgresql://stafferfi:stafferfi_dev@stafferfi-postgres:5432/ecfr_analytics' \
  stafferfi-all

echo "🚀 StafferFi USDS Demo"
echo "=========================================="
echo "Web UI:  http://localhost:3000"
echo "API:     http://localhost:4000"
echo "Lake:    http://localhost:8000"
```

### 2. Start Postgres in Docker

```bash
sudo docker network create stafferfi-net || true

sudo docker rm -f stafferfi-postgres || true
sudo docker run -d \
  --name stafferfi-postgres \
  --network stafferfi-net \
  -e POSTGRES_USER=stafferfi \
  -e POSTGRES_PASSWORD=stafferfi_dev \
  -e POSTGRES_DB=ecfr_analytics \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Run the all‑in‑one app container

```bash
sudo docker run --rm \
  --name stafferfi-all \
  --network stafferfi-net \
  -p 3000:3000 -p 4000:4000 -p 8000:8000 \
  -e DATABASE_URL='postgresql://stafferfi:stafferfi_dev@stafferfi-postgres:5432/ecfr_analytics' \
  stafferfi-all
```

Inside `stafferfi-all`, `supervisord` will:

- Run `lake_pipeline` (DuckDB ingestion + ETL to Postgres).
- Start:
  - Next.js web on port 3000.
  - Node API on port 4000.
  - Gunicorn lake app on port 8000.

## Operations Runbook (local docker)

#### ⚠ Important Notice

This runbook is in active development. Contributions are welcome.

### Docker Compose

The easiest way to run the full stack locally is via Docker Compose.

AC

- Start a Postgres container.
- Run the DuckDB → Postgres pipeline (ingestion + ETL) once.
- Start the API and web UI, wired to dev Postgres.

From the repo root:

```bash
# Build and run all services
sudo docker compose up --build
```

Then open:

- Web UI:  http://localhost:3000  
- API:     http://localhost:4000  
- Lake:    http://localhost:8000  

To stop everything:

```bash
sudo docker compose down
```

### What Compose Does

`docker-compose.yml` defines:

- `postgres` – Postgres 16 (non-persistent for MVP):
  - `POSTGRES_DB=ecfr_analytics`
  - `POSTGRES_USER=stafferfi`
  - `POSTGRES_PASSWORD=stafferfi_dev`
- `etl` – one-shot data loader:
  - Waits for `postgres` to be healthy, then runs:
    ```bash
    /opt/venv/bin/python apps/lake/ingestion.py \
      && /opt/venv/bin/python apps/lake/etl_to_postgres.py
    ```
  - Uses `DATABASE_URL=postgresql://stafferfi:stafferfi_dev@postgres:5432/ecfr_analytics`.
- `api` – Node/Express API:
  - Depends on healthy `postgres` and successful `etl`.
  - Exposed on `http://localhost:4000`.
- `web` – Next.js frontend:
  - Depends on `api`.
  - Exposed on `http://localhost:3000`.

All of these use the same `Dockerfile` (`target: runner`) and are built from the monorepo.

### Known Issues

- Docker compose e2e orchestration pending [DuckDB locking conflict](./supervisord.conf)
- Active work on [Local (Production Staging) Development Environment](./local-dev.sh)
- Current work on [Orchestration](./docker-start.sh)

## SRE

### Check running containers

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

### View logs (Compose)

```bash
sudo docker compose logs -f
```

### View logs (single container)

```bash
sudo docker logs stafferfi-all
sudo docker logs stafferfi-postgres
```

### Inspect processes inside the all-in-one container

```bash
sudo docker exec -it stafferfi-all bash

# Inside the container:
supervisorctl -c /etc/supervisord.conf status
supervisorctl -c /etc/supervisord.conf tail lake_pipeline stdout
supervisorctl -c /etc/supervisord.conf tail api stdout
supervisorctl -c /etc/supervisord.conf tail web stdout
```

### Reset the stack (Compose)

```bash
sudo docker compose down -v
sudo docker compose up --build
```

## Roadmap
- Migrations for persistant production data store.
