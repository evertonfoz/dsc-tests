#!/usr/bin/env bash
# Conteúdo inválido impede a imagem (M0, critério 1; M1, linha "Pré-requisito").
# Para cada caso: copia o contexto para uma pasta temporária, quebra UM arquivo na CÓPIA
# (o repositório não é alterado) e confere que o docker build falha com a mensagem esperada.
# Uso: curso-app/scripts/testar-construcao-negativa.sh
set -euo pipefail

raiz="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
falhas=0

copiar_conteudo_uc12() {
  local destino="$1"
  mkdir -p "$destino/celilac-backend/docs/uc" "$destino/celilac-backend/docs/planejamento/uc12-cadastrar-produto"
  cp -R "$raiz/celilac-backend/docs/uc/uc12" "$destino/celilac-backend/docs/uc/"
  cp "$raiz/celilac-backend/docs/planejamento/uc12-cadastrar-produto/uc-12.md" \
    "$destino/celilac-backend/docs/planejamento/uc12-cadastrar-produto/uc-12.md"
}

# caso <descrição> <arquivo do curso> <programa awk que altera a cópia> <mensagem esperada>
caso() {
  local descricao="$1" arquivo="$2" programa="$3" esperado="$4"
  local tmp
  tmp="$(mktemp -d)"
  mkdir -p "$tmp/celilac-backend/method/didatico"
  mkdir -p "$tmp/mascotes"
  rsync -a --exclude node_modules --exclude dist --exclude .astro --exclude test-results "$raiz/curso-app" "$tmp/"
  cp -R "$raiz/celilac-backend/method/didatico/curso" "$tmp/celilac-backend/method/didatico/"
  cp -R "$raiz/mascotes/web" "$tmp/mascotes/"
  copiar_conteudo_uc12 "$tmp"
  local alvo="$tmp/celilac-backend/method/didatico/curso/$arquivo"
  awk "$programa" "$alvo" >"$alvo.novo"
  if cmp -s "$alvo" "$alvo.novo"; then
    echo "FALHA $descricao: não consegui alterar a cópia de $arquivo"; falhas=$((falhas + 1)); rm -rf "$tmp"; return
  fi
  mv "$alvo.novo" "$alvo"

  local saida="$tmp/saida.txt"
  if docker build -f "$tmp/curso-app/Dockerfile" --progress=plain --no-cache \
       --build-arg ORIGEM_COMMIT=0000000 --build-arg ORIGEM_DATA=2026-01-01T00:00:00Z \
       -t curso-app:negativo "$tmp" >"$saida" 2>&1; then
    echo "FALHA $descricao: a imagem foi gerada com conteúdo inválido"
    docker image rm curso-app:negativo >/dev/null 2>&1 || true
    falhas=$((falhas + 1))
  elif grep -qF "$esperado" "$saida"; then
    echo "OK    $descricao: a construção falhou com: $esperado"
  else
    echo "FALHA $descricao: a construção falhou, mas sem a mensagem esperada. Últimas linhas:"
    tail -30 "$saida"
    falhas=$((falhas + 1))
  fi
  rm -rf "$tmp"
}

# M0, critério 1: o primeiro pré-requisito do m05 vira um id que não existe.
caso "(M0-1) pré-requisito inexistente" m05-onde-mora-a-regra.md \
  '!feito && /^prerequisitos: \[/ { sub(/\[[a-z0-9-]+/, "[m99"); feito = 1 } { print }' \
  'conteúdo inválido: m05-onde-mora-a-regra.md: prerequisitos: "m99" não existe'

# M1: a linha "Pré-requisito" do corpo do m05 passa a citar o módulo 4 em vez do 3.
caso "(M1) linha Pré-requisito divergente" m05-onde-mora-a-regra.md \
  '!feito && /^> \*\*Pré-requisito:\*\* módulo 3/ { sub(/módulo 3/, "módulo 4"); feito = 1 } { print }' \
  'conteúdo inválido: m05-onde-mora-a-regra.md: linha "Pré-requisito": não cita "m03", que está em prerequisitos'

# M2: retirar uma evidência que o state.yaml cita impede a construção.
tmp="$(mktemp -d)"
mkdir -p "$tmp/celilac-backend/method/didatico" "$tmp/mascotes"
rsync -a --exclude node_modules --exclude dist --exclude .astro --exclude test-results "$raiz/curso-app" "$tmp/"
cp -R "$raiz/celilac-backend/method/didatico/curso" "$tmp/celilac-backend/method/didatico/"
cp -R "$raiz/mascotes/web" "$tmp/mascotes/"
copiar_conteudo_uc12 "$tmp"
rm "$tmp/celilac-backend/docs/uc/uc12/evidencias/F/cobertura.md"
saida="$tmp/saida.txt"
if docker build -f "$tmp/curso-app/Dockerfile" --progress=plain --no-cache \
     --build-arg ORIGEM_COMMIT=0000000 --build-arg ORIGEM_DATA=2026-01-01T00:00:00Z \
     -t curso-app:negativo "$tmp" >"$saida" 2>&1; then
  echo "FALHA (M2) evidência ausente: a imagem foi gerada"
  docker image rm curso-app:negativo >/dev/null 2>&1 || true
  falhas=$((falhas + 1))
elif grep -qF 'state.yaml cita arquivo inexistente: docs/uc/uc12/evidencias/F/cobertura.md' "$saida"; then
  echo "OK    (M2) evidência citada ausente impede a construção"
else
  echo "FALHA (M2) evidência ausente: erro inesperado. Últimas linhas:"
  tail -30 "$saida"
  falhas=$((falhas + 1))
fi
rm -rf "$tmp"

if [ "$falhas" -gt 0 ]; then echo "$falhas caso(s) com falha."; exit 1; fi
