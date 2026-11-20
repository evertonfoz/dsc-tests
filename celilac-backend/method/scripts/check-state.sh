#!/usr/bin/env bash
# Atalho para o validador do state.yaml.
# Uso: method/scripts/check-state.sh docs/uc/<uc>/state.yaml [--remote]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$DIR/check-state.mjs" "$@"
