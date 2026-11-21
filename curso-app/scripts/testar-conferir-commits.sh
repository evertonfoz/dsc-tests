#!/usr/bin/env bash
# Critério P7 do M1: commit citado que não existe impede a imagem.
# Cria um repositório temporário com um arquivo que cita um commit inexistente e confere a saída 1.
# Uso: curso-app/scripts/testar-conferir-commits.sh
set -euo pipefail

script="$(cd "$(dirname "$0")" && pwd)/conferir-commits.mjs"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git -C "$tmp" init -q
mkdir "$tmp/curso"
printf 'No commit `deadbee1` a regra mudou.\nExemplo inventado `abc1234` <!-- commits:ignore -->\n' >"$tmp/curso/m99.md"

set +e
saida="$(node "$script" "$tmp/curso" 2>&1)"
codigo=$?
set -e
if [ "$codigo" -eq 1 ] && grep -qF 'commit citado não existe: m99.md:1: deadbee1' <<<"$saida" && ! grep -q abc1234 <<<"$saida"; then
  echo "OK    (P7) commit inexistente recusado com saída 1; linha marcada com commits:ignore aceita"
else
  echo "FALHA (P7) saída $codigo:"; echo "$saida"; exit 1
fi
