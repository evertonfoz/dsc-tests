#!/usr/bin/env bash
# Verificação local do projeto, na mesma ordem do project-profile.md e do CI.
#
# Uso:
#   scripts/verify.sh                  rápido: lint, build, testes rápidos, validadores e documentos (sem banco)
#   scripts/verify.sh --completo       + integração e E2E (exige o postgres_test no ar e TEST_DB_* no .env)
#   scripts/verify.sh --instalar       antes de tudo, pnpm install --frozen-lockfile
#   scripts/verify.sh --remote         valida também o state.yaml contra o GitHub (exige `gh` autenticado)
#   scripts/verify.sh --incluir-falhas-conhecidas   não exclui as falhas do exercício de `orders` (ADR-001)
#
# Segurança: não usa `docker compose down`, `-v`, DROP, TRUNCATE nem migration:revert.
# Saída: 0 se todos os passos passaram; 1 se algum falhou; 2 uso incorreto.
set -u
cd "$(dirname "$0")/.." || exit 1

COMPLETO=0; INSTALAR=0; REMOTE=0; INCLUIR=0
for a in "$@"; do
  case "$a" in
    --completo) COMPLETO=1 ;;
    --instalar) INSTALAR=1 ;;
    --remote) REMOTE=1 ;;
    --incluir-falhas-conhecidas) INCLUIR=1 ;;
    -h|--ajuda|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "opção desconhecida: $a (use --ajuda)" >&2; exit 2 ;;
  esac
done

# Lista única de falhas conhecidas (ADR-001)
KNOWN_FAILURES_UNIT=""; KNOWN_FAILURES_E2E=""
if [ -f scripts/known-failures.env ]; then . scripts/known-failures.env; fi

LOGDIR="$(mktemp -d "${TMPDIR:-/tmp}/verify.XXXXXX")"
trap 'rm -rf "$LOGDIR"' EXIT
total=0; falhas=0; resumo=""

passo() { # passo "descrição" comando args...
  local desc="$1"; shift
  total=$((total + 1))
  local log="$LOGDIR/$total.log" ini fim
  ini=$(date +%s)
  printf '[%02d] %-58s ' "$total" "$desc"
  if "$@" >"$log" 2>&1; then
    fim=$(date +%s); printf 'OK    (%ss)\n' $((fim - ini))
    resumo="$resumo  OK    $desc"$'\n'
  else
    fim=$(date +%s); printf 'FALHOU (%ss)\n' $((fim - ini))
    falhas=$((falhas + 1)); resumo="$resumo  FALHOU $desc"$'\n'
    echo "     --- últimas linhas de saída ---"
    tail -n 20 "$log" | sed 's/^/     | /'
  fi
}

verificar_estados() {
  local achou=0 f rc=0
  for f in docs/uc/*/state.yaml; do
    [ -e "$f" ] || continue
    achou=1
    if [ "$REMOTE" -eq 1 ]; then node method/scripts/check-state.mjs "$f" --remote || rc=1
    else node method/scripts/check-state.mjs "$f" || rc=1; fi
  done
  [ "$achou" -eq 0 ] && echo "Nenhum docs/uc/*/state.yaml encontrado: nada a validar."
  return $rc
}

banco_de_testes_acessivel() {
  node --input-type=module - <<'JS'
import 'dotenv/config';
import net from 'node:net';
const host = process.env.TEST_DB_HOST, port = Number(process.env.TEST_DB_PORT);
if (!host || !port) { console.error('TEST_DB_HOST/TEST_DB_PORT ausentes no .env (veja .env.example).'); process.exit(1); }
const s = net.connect({ host, port, timeout: 3000 });
s.on('connect', () => { console.log(`banco de testes acessível em ${host}:${port}`); s.end(); process.exit(0); });
s.on('timeout', () => { console.error(`sem resposta em ${host}:${port}. Suba com: docker compose up -d postgres_test`); process.exit(1); });
s.on('error', (e) => { console.error(`banco de testes inacessível em ${host}:${port} (${e.code}). Suba com: docker compose up -d postgres_test`); process.exit(1); });
JS
}

echo "Verificação de $(basename "$PWD") — modo: $([ "$COMPLETO" -eq 1 ] && echo completo || echo rápido)"
echo "----------------------------------------------------------------------"

if [ "$INSTALAR" -eq 1 ]; then passo "Instalar dependências (lockfile congelado)" pnpm install --frozen-lockfile; fi
passo "Lint" pnpm lint
passo "Build" pnpm build
if [ "$INCLUIR" -eq 1 ] || [ -z "$KNOWN_FAILURES_UNIT" ]; then
  passo "Testes rápidos (incluindo falhas conhecidas)" pnpm test
else
  passo "Testes rápidos (sem as falhas conhecidas, ADR-001)" pnpm test --exclude "$KNOWN_FAILURES_UNIT"
fi
passo "Testes dos validadores do método (estado e links)" bash method/scripts/testes/rodar-testes.sh
passo "Documentos: links e caminhos citados existem" node method/scripts/check-links.mjs
passo "Estado dos casos de uso (state.yaml)" verificar_estados

if [ "$COMPLETO" -eq 1 ]; then
  passo "Banco de testes acessível" banco_de_testes_acessivel
  passo "Integração (banco real de testes)" pnpm test:integration
  if [ "$INCLUIR" -eq 1 ] || [ -z "$KNOWN_FAILURES_E2E" ]; then
    passo "E2E (banco de testes, incluindo falhas conhecidas)" pnpm test:e2e
  else
    passo "E2E (banco de testes, sem as falhas conhecidas, ADR-001)" pnpm test:e2e --exclude "$KNOWN_FAILURES_E2E"
  fi
fi

echo "----------------------------------------------------------------------"
if [ "$falhas" -eq 0 ]; then echo "RESULTADO: $total passo(s), todos OK."; exit 0; fi
echo "RESULTADO: $falhas de $total passo(s) falharam:"; printf '%s' "$resumo" | grep '^  FALHOU'
exit 1
