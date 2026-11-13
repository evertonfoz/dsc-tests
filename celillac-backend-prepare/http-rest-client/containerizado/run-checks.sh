#!/usr/bin/env bash
# Verificação automatizada do ambiente containerizado (API + PostgreSQL em Docker Compose).
# Uso:  ./http-rest-client/containerizado/run-checks.sh [--durability]
#   --durability  reinicia SOMENTE a API (docker compose restart api) e confere o registro no banco.
# Não remove volumes, não usa `down -v` e só grava em products.products via POST /products.
set -u
BASE="${BASE_URL:-http://localhost:3200}"
cd "$(dirname "$0")/../.." || exit 1

pass=0; fail=0
check() { # descrição, esperado, obtido
  if [ "$2" = "$3" ]; then echo "  ok    $1 ($3)"; pass=$((pass+1)); else echo "  FALHA $1 (esperado $2, obtido $3)"; fail=$((fail+1)); fi
}
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
post_products() { curl -s -X POST "$BASE/products" -H 'Content-Type: application/json' -d "$1"; }
sql() { docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA' <<<"$1"; }

echo "== Serviços"
docker compose ps --format '{{.Name}} {{.Status}}'
check "api em execução" "1" "$(docker compose ps --format '{{.Name}} {{.Status}}' | grep -c '^celilac-api Up')"
check "postgres healthy" "1" "$(docker compose ps --format '{{.Name}} {{.Status}}' | grep -c '^celilac-postgres .*healthy')"

echo "== Smoke"
check "GET /" "200" "$(status "$BASE/")"
check "rota inexistente" "404" "$(status "$BASE/rota-que-nao-existe")"

echo "== Migrations (somente leitura)"
pend=$(docker compose run --rm --no-deps api pnpm migration:show:prod 2>&1 | grep -c '^\[ \]')
check "migrations pendentes" "0" "$pend"

echo "== UC12 — POST /products"
H='Content-Type: application/json'
check "nome vazio"        "400" "$(status -X POST "$BASE/products" -H "$H" -d '{"name":""}')"
check "name ausente"      "400" "$(status -X POST "$BASE/products" -H "$H" -d '{}')"
check "name não string"   "400" "$(status -X POST "$BASE/products" -H "$H" -d '{"name":12345}')"
resp=$(post_products '{"name":"Produto verificacao containerizada","price":10}')
id=$(sed -n 's/.*"productId":"\([^"]*\)".*/\1/p' <<<"$resp")
check "cadastro válido devolve productId" "1" "$([ -n "$id" ] && echo 1 || echo 0)"
check "price descartado (whitelist)" "0" "$(grep -c '"price"' <<<"$resp")"

echo "== Orders — fronteira sem seed"
check "UUID malformado"  "400" "$(status -X POST "$BASE/orders/abc-123/confirm")"
check "pedido inexistente" "404" "$(status -X POST "$BASE/orders/f6712211-753f-4110-a8d3-36f58d68d56e/confirm")"

echo "== PostgreSQL (celilac_db)"
q="SELECT name FROM products.products WHERE \"productId\" = '$id';"
if [ -z "$id" ]; then
  echo "  FALHA sem productId para consultar o banco (cadastro falhou)"; fail=$((fail+1))
else
  check "registro gravado" "Produto verificacao containerizada" "$(sql "$q")"
fi

if [ "${1:-}" = "--durability" ] && [ -n "$id" ]; then
  echo "== Durabilidade (restart somente da API)"
  docker compose restart api >/dev/null 2>&1
  for _ in $(seq 1 30); do curl -s -o /dev/null "$BASE/" && break; sleep 1; done
  check "API voltou" "200" "$(status "$BASE/")"
  check "registro após restart" "Produto verificacao containerizada" "$(sql "$q")"
fi

echo; echo "Resultado: $pass ok, $fail falha(s)"
[ "$fail" -eq 0 ]
