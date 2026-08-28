#!/usr/bin/env bash
# Start the Nandini Vision API.
# Usage: ./back/run.sh          (uses .venv if present, else system python)
set -euo pipefail
cd "$(dirname "$0")"

if [ -d ".venv" ]; then
  source .venv/bin/activate
fi

exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
