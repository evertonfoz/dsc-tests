#!/usr/bin/env bash
# Critério 1 do M0: front matter inválido impede a imagem.
# Copia o contexto para uma pasta temporária, quebra UM front matter na CÓPIA
# (o repositório não é alterado) e confere que o docker build falha com a mensagem esperada.
# Uso: curso-app/scripts/testar-construcao-negativa.sh
set -euo pipefail

raiz="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "$tmp/celilac-backend/method/didatico"
rsync -a --exclude node_modules --exclude dist --exclude .astro "$raiz/curso-app" "$tmp/"
cp -R "$raiz/celilac-backend/method/didatico/curso" "$tmp/celilac-backend/method/didatico/"

alvo="$tmp/celilac-backend/method/didatico/curso/m05-onde-mora-a-regra.md"
# Troca o primeiro pré-requisito por um id que não existe.
awk '!feito && /^prerequisitos: \[/ { sub(/\[[a-z0-9-]+/, "[m99"); feito = 1 } { print }' "$alvo" >"$alvo.novo"
mv "$alvo.novo" "$alvo"
grep -q '^prerequisitos: \[m99' "$alvo" || { echo "FALHA: não consegui quebrar o front matter da cópia"; exit 1; }

saida="$tmp/saida.txt"
if docker build -f "$tmp/curso-app/Dockerfile" --progress=plain --no-cache \
     --build-arg ORIGEM_COMMIT=0000000 --build-arg ORIGEM_DATA=2026-01-01T00:00:00Z \
     -t curso-app:negativo "$tmp" >"$saida" 2>&1; then
  echo "FALHA (1): a imagem foi gerada com front matter inválido"
  docker image rm curso-app:negativo >/dev/null 2>&1 || true
  exit 1
fi
esperado='conteúdo inválido: m05-onde-mora-a-regra.md: prerequisitos: "m99" não existe'
if grep -qF "$esperado" "$saida"; then
  echo "OK    (1) a construção falhou com: $esperado"
else
  echo "FALHA (1): a construção falhou, mas sem a mensagem esperada. Últimas linhas:"
  tail -30 "$saida"
  exit 1
fi
