#!/usr/bin/env bash
# Testes no navegador (Playwright e axe-core) contra a IMAGEM construída (E7, seção 6; plano do M1, seção 11).
# Sobe o contêiner com as mesmas opções de executar.sh, roda os testes e remove o contêiner.
# Uso: curso-app/scripts/testar-navegador.sh [imagem]   (exige pnpm install e o Chromium do Playwright)
set -euo pipefail

imagem="${1:-curso-app:local}"
nome="curso-app-navegador-$$"
pasta="$(cd "$(dirname "$0")/.." && pwd)"

limpar() { docker rm -f "$nome" >/dev/null 2>&1 || true; }
trap limpar EXIT

docker run -d --name "$nome" --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  -p 127.0.0.1:4321:8080 "$imagem" >/dev/null
for _ in $(seq 1 30); do
  curl -fsS -o /dev/null http://127.0.0.1:4321/ 2>/dev/null && break
  sleep 0.5
done

cd "$pasta"
URL_BASE=http://127.0.0.1:4321 pnpm exec playwright test
