#!/usr/bin/env bash
# Verificação local do projeto, na ordem do project-profile.md.
# Não há integração contínua nesta entrega (ADR-003): esta é a verificação disponível.
#
# Uso:
#   scripts/verify.sh            instalação travada, lint, testes, build, validadores e documentos
#   scripts/verify.sh --remote   também confere o state.yaml com o GitHub (exige `gh` autenticado)
#
# Os testes no navegador não fazem parte deste script.
# Saída: 0 se todos os passos passaram; 1 se algum falhou; 2 uso incorreto.
set -u
cd "$(dirname "$0")/.." || exit 1

REMOTE=0
for a in "$@"; do
  case "$a" in
    --remote) REMOTE=1 ;;
    -h|--ajuda|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "opção desconhecida: $a (use --ajuda)" >&2; exit 2 ;;
  esac
done

LOGDIR="$(mktemp -d "${TMPDIR:-/tmp}/verify.XXXXXX")" || exit 1
trap 'rm -rf "$LOGDIR"' EXIT
total=0; falhas=0; resumo=""

passo() { # passo "descrição" comando args...
  local desc="$1"; shift
  total=$((total + 1))
  local log="$LOGDIR/$total.log"
  if "$@" >"$log" 2>&1; then
    echo "[$total] OK      $desc"
  else
    echo "[$total] FALHOU  $desc"
    falhas=$((falhas + 1)); resumo="$resumo  FALHOU $desc"$'\n'
    echo "     --- últimas linhas de saída ---"
    tail -n 30 "$log" | sed 's/^/     | /'
  fi
}

verificar_estados() {
  local achou=0 f rc=0
  for f in docs/uc/*/state.yaml; do
    [ -e "$f" ] || continue
    achou=1
    if [ "$REMOTE" -eq 1 ]; then method/scripts/check-state.sh "$f" --remote || rc=1
    else method/scripts/check-state.sh "$f" || rc=1; fi
  done
  if [ "$achou" -eq 0 ]; then echo "Nenhum docs/uc/*/state.yaml encontrado."; return 1; fi
  return $rc
}

echo "Verificação de $(basename "$PWD") — Node $(node -v), pnpm $(pnpm -v)"
echo "----------------------------------------------------------------------"

passo "Instalar dependências (arquivo de travamento)" pnpm install --frozen-lockfile
passo "Lint" pnpm lint
passo "Testes" pnpm test
passo "Build" pnpm build
passo "Testes dos validadores do método" bash method/scripts/testes/rodar-testes.sh
passo "Documentos: links e caminhos citados existem" \
  node method/scripts/check-links.mjs method docs project-profile.md prompts README.md
passo "Estado dos casos de uso (state.yaml)" verificar_estados

echo "----------------------------------------------------------------------"
if [ "$falhas" -eq 0 ]; then echo "RESULTADO: $total passos, todos OK."; exit 0; fi
echo "RESULTADO: $falhas de $total passos falharam:"; printf '%s' "$resumo"
exit 1
