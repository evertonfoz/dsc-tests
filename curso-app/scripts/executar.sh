#!/usr/bin/env bash
# Executa a aplicação do curso só no endereço local fixo (E7, seção 3, item 5).
# Outro endereço ou outra porta guardam outro progresso no navegador (E4, seção 4).
set -euo pipefail

echo "Aplicação do curso em http://127.0.0.1:4321 (Ctrl+C para parar)."
exec docker run --rm --name curso-app \
  --read-only --tmpfs /tmp \
  --cap-drop ALL --security-opt no-new-privileges \
  -p 127.0.0.1:4321:8080 \
  curso-app:local
