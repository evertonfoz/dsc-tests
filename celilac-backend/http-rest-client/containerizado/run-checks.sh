#!/usr/bin/env bash
# Verificação automatizada do ambiente containerizado (API + banco em Docker Compose).
# Uso:  ./http-rest-client/containerizado/run-checks.sh [--durability]
#   --durability  reinicia SOMENTE a API e confere o registro no banco.
# Não remove volumes, não usa `down -v` e só grava via POST no recurso do caso de uso.
set -u
BASE="${BASE_URL:-http://localhost:3200}"
cd "$(dirname "$0")/../.." || exit 1

DURABILITY=0
if [ "${1:-}" = "--durability" ]; then
  DURABILITY=1
fi

pass=0
fail=0

check() {
  local desc="$1"
  local expected="$2"
  local actual="$3"

  if [ "$expected" = "$actual" ]; then
    echo "[OK]    $desc (esperado: '$expected', obtido: '$actual')"
    pass=$((pass + 1))
  else
    echo "[FALHA] $desc (esperado: '$expected', obtido: '$actual')"
    fail=$((fail + 1))
  fi
}

status() {
  curl -s -o /dev/null -w '%{http_code}' "$@"
}

sql() {
  docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA'
}

extract_json_field() {
  local json="$1"
  local field="$2"
  if command -v jq >/dev/null 2>&1; then
    echo "$json" | jq -r --arg f "$field" '.[$f] // empty'
  elif command -v node >/dev/null 2>&1; then
    node -e "try { const obj = JSON.parse(process.argv[1]); console.log(obj[process.argv[2]] ?? ''); } catch { console.log(''); }" "$json" "$field"
  else
    echo "$json" | sed -n "s/.*\"$field\":\"\([^\"]*\)\".*/\1/p"
  fi
}

echo "================================================================================"
echo "Iniciando verificações automatizadas da API CeliLac em $BASE"
echo "================================================================================"

# ------------------------------------------------------------------------------
# 1. Serviços: API em Up e banco healthy
# ------------------------------------------------------------------------------
echo
echo "--- 1. Serviços em Docker Compose ---"
api_state=$(docker compose ps --format '{{.Service}} {{.State}}' | grep '^api' | awk '{print $2}' || true)
check "Serviço API em execução ('running')" "running" "$api_state"

db_health=$(docker compose ps --format '{{.Service}} {{.Health}}' | grep '^postgres ' | awk '{print $2}' || true)
check "Serviço Postgres saudável ('healthy')" "healthy" "$db_health"

# ------------------------------------------------------------------------------
# 2. Smoke: GET / -> 200; rota inexistente -> 404
# ------------------------------------------------------------------------------
echo
echo "--- 2. Smoke Tests HTTP ---"
smoke_root=$(status "$BASE/")
check "Smoke: GET / retorna 200" "200" "$smoke_root"

smoke_not_found=$(status "$BASE/rota-inexistente-para-validacao-de-smoke")
check "Smoke: GET rota inexistente retorna 404" "404" "$smoke_not_found"

# ------------------------------------------------------------------------------
# 3. Migrations (somente leitura): esperar 0 pendentes
# ------------------------------------------------------------------------------
echo
echo "--- 3. Migrations no Banco de Desenvolvimento (Somente Leitura) ---"
pending_migrations=$(docker compose exec -T api pnpm migration:show:prod 2>/dev/null | grep -E '^\[ \]' | wc -l | tr -d ' ' || echo "erro")
check "Nenhuma migration pendente no banco de dados" "0" "$pending_migrations"

# ------------------------------------------------------------------------------
# 4. Caso de uso: POST /products (UC12)
# ------------------------------------------------------------------------------
echo
echo "--- 4. Caso de Uso UC12 — Cadastrar Produto (POST /products) ---"
timestamp=$(date +%s)
code_empty_name=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d '{"name":""}')
check "Validação: nome vazio retorna 400" "400" "$code_empty_name"

code_missing_name=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d '{}')
check "Validação: nome ausente retorna 400" "400" "$code_missing_name"

code_invalid_type=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d '{"name":12345}')
check "Validação: nome com tipo inválido retorna 400" "400" "$code_invalid_type"

product_name="Pão Automatizado Run-Checks $timestamp"
product_response=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" -d "{\"name\":\"$product_name\"}")
created_id=$(extract_json_field "$product_response" "productId")
created_name=$(extract_json_field "$product_response" "name")

if [ -n "$created_id" ]; then
  check "Cadastro com sucesso retorna identificador UUID preenchido" "true" "true"
else
  check "Cadastro com sucesso retorna identificador UUID preenchido" "true" "false"
fi
check "Cadastro com sucesso retorna o nome enviado" "$product_name" "$created_name"

code_blank_name=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d '{"name":"   "}')
check "Validação: nome só com espaços retorna 400" "400" "$code_blank_name"

long_name=$(printf 'x%.0s' $(seq 1 121))
code_long_name=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d "{\"name\":\"$long_name\"}")
check "Validação: nome com 121 caracteres retorna 400" "400" "$code_long_name"

# Limite exato: 120 caracteres é aceito (nome único por execução, completado com 'y' até 120)
limit_prefix="Limite $timestamp "
limit_name="$limit_prefix$(printf 'y%.0s' $(seq 1 $((120 - ${#limit_prefix}))))"
limit_response=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" -d "{\"name\":\"$limit_name\"}")
limit_id=$(extract_json_field "$limit_response" "productId")
if [ -n "$limit_id" ]; then
  check "Validação: nome com exatamente 120 caracteres retorna 201 com identificador" "true" "true"
else
  check "Validação: nome com exatamente 120 caracteres retorna 201 com identificador" "true" "false"
fi

code_bad_json=$(status -X POST "$BASE/products" -H "Content-Type: application/json" -d '{bad')
check "Contrato: JSON inválido retorna 400" "400" "$code_bad_json"

error_body=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" -d '{"name":""}')
check "Contrato: o 400 traz message (lista), error e statusCode" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(Array.isArray(b.message)&&b.error==='Bad Request'&&b.statusCode===400)}catch{console.log(false)}" "$error_body")"

# UC13: GET /products passou a listar produtos ativos (antes era 404).
code_get_products=$(status "$BASE/products")
check "Contrato UC13: GET /products retorna 200" "200" "$code_get_products"

list_body=$(curl -s "$BASE/products?page=1&limit=5")
check "Contrato UC13: a listagem traz items, page, limit e total" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(Array.isArray(b.items)&&b.page===1&&b.limit===5&&typeof b.total==='number')}catch{console.log(false)}" "$list_body")"
check "Contrato UC13: cada item traz somente productId e name" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(b.items.every(i=>Object.keys(i).sort().join()==='name,productId'))}catch{console.log(false)}" "$list_body")"
default_limit=$(curl -s "$BASE/products" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).limit)}catch{console.log('')}})")
check "Contrato UC13: o limite padrão é 20" "20" "$default_limit"

code_limit_alto=$(status "$BASE/products?limit=101")
check "Contrato UC13: limit=101 retorna 400" "400" "$code_limit_alto"
code_page_zero=$(status "$BASE/products?page=0")
check "Contrato UC13: page=0 retorna 400" "400" "$code_page_zero"
code_limit_texto=$(status "$BASE/products?limit=abc")
check "Contrato UC13: limit não numérico retorna 400" "400" "$code_limit_texto"

db_active_total=$(echo 'SELECT count(*) FROM products.products WHERE "deletedAt" IS NULL;' | sql | tr -d '\r')
api_total=$(curl -s "$BASE/products?limit=1" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).total)}catch{console.log('')}})")
check "Contrato UC13: total da API confere com os produtos ativos no banco" "$db_active_total" "$api_total"

# UC14: GET /products/:productId (somente leitura; usa o produto criado acima).
if [ -n "$created_id" ]; then
  get_body=$(curl -s "$BASE/products/$created_id")
  code_get_one=$(status "$BASE/products/$created_id")
  check "Contrato UC14: GET /products/:productId retorna 200" "200" "$code_get_one"
  check "Contrato UC14: a busca traz somente productId e name" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(Object.keys(b).sort().join()==='name,productId')}catch{console.log(false)}" "$get_body")"
  check "Contrato UC14: a busca devolve o produto cadastrado" "$product_name" "$(extract_json_field "$get_body" "name")"
else
  check "Contrato UC14: busca requer produto cadastrado" "id_valido" "id_vazio"
fi
missing_body=$(curl -s "$BASE/products/99999999-9999-4999-8999-999999999999")
code_missing=$(status "$BASE/products/99999999-9999-4999-8999-999999999999")
check "Contrato UC14: UUID sem produto retorna 404" "404" "$code_missing"
check "Contrato UC14: o 404 traz error ProductNotFoundException" "ProductNotFoundException" "$(extract_json_field "$missing_body" "error")"
bad_id_body=$(curl -s "$BASE/products/abc")
code_bad_id=$(status "$BASE/products/abc")
check "Contrato UC14: identificador que não é UUID retorna 400" "400" "$code_bad_id"
check "Contrato UC14: o 400 traz message (lista) e error Bad Request" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(Array.isArray(b.message)&&b.error==='Bad Request'&&b.statusCode===400)}catch{console.log(false)}" "$bad_id_body")"
code_subroute=$(status "$BASE/products/99999999-9999-4999-8999-999999999999/extra")
check "Contrato UC14: sub-rota inexistente retorna 404" "404" "$code_subroute"

# UC15: PUT /products/:productId (GRAVA: altera apenas o produto criado pelo teste de limite acima).
if [ -n "$limit_id" ]; then
  uc15_name="UC15 alterado $timestamp"
  put_body=$(curl -s -X PUT "$BASE/products/$limit_id" -H "Content-Type: application/json" -d "{\"name\":\"$uc15_name\",\"productId\":\"99999999-9999-4999-8999-999999999999\"}")
  check "Contrato UC15: PUT /products/:productId traz somente productId e name" "true" "$(node -e "try{const b=JSON.parse(process.argv[1]);console.log(Object.keys(b).sort().join()==='name,productId')}catch{console.log(false)}" "$put_body")"
  check "Contrato UC15: o PUT devolve o nome novo" "$uc15_name" "$(extract_json_field "$put_body" "name")"
  check "Contrato UC15: o productId do corpo é ignorado (vale o da rota)" "$limit_id" "$(extract_json_field "$put_body" "productId")"
  uc15_db_name=$(echo "SELECT name FROM products.products WHERE \"productId\" = '$limit_id';" | sql | tr -d '\r')
  check "Contrato UC15: o nome novo foi gravado no banco" "$uc15_name" "$uc15_db_name"
  code_put_empty=$(status -X PUT "$BASE/products/$limit_id" -H "Content-Type: application/json" -d '{"name":""}')
  check "Contrato UC15: PUT com nome vazio retorna 400" "400" "$code_put_empty"
  uc15_db_after=$(echo "SELECT name FROM products.products WHERE \"productId\" = '$limit_id';" | sql | tr -d '\r')
  check "Contrato UC15: o 400 não altera o nome gravado" "$uc15_name" "$uc15_db_after"
else
  check "Contrato UC15: alteração requer produto cadastrado" "id_valido" "id_vazio"
fi
put_missing_body=$(curl -s -X PUT "$BASE/products/99999999-9999-4999-8999-999999999999" -H "Content-Type: application/json" -d '{"name":"x"}')
code_put_missing=$(status -X PUT "$BASE/products/99999999-9999-4999-8999-999999999999" -H "Content-Type: application/json" -d '{"name":"x"}')
check "Contrato UC15: PUT em UUID sem produto retorna 404" "404" "$code_put_missing"
check "Contrato UC15: o 404 traz error ProductNotFoundException" "ProductNotFoundException" "$(extract_json_field "$put_missing_body" "error")"
code_put_bad_id=$(status -X PUT "$BASE/products/abc" -H "Content-Type: application/json" -d '{"name":"x"}')
check "Contrato UC15: PUT com identificador que não é UUID retorna 400" "400" "$code_put_bad_id"

# UC16: DELETE /products/:productId (GRAVA: cria UM produto próprio e remove apenas esse; remoção lógica, o registro fica no banco).
uc16_name="UC16 removido $timestamp"
uc16_response=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" -d "{\"name\":\"$uc16_name\"}")
uc16_id=$(extract_json_field "$uc16_response" "productId")
if [ -n "$uc16_id" ]; then
  uc16_total_before=$(curl -s "$BASE/products?limit=1" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).total)}catch{console.log('')}})")
  code_del=$(curl -s -o /tmp/uc16-del-body.$$ -w '%{http_code}' -X DELETE "$BASE/products/$uc16_id" -H "Content-Type: application/json" -d '{"name":"ignorado","deletedAt":null}')
  check "Contrato UC16: DELETE /products/:productId retorna 204 (corpo ignorado)" "204" "$code_del"
  check "Contrato UC16: o 204 vem sem corpo" "0" "$(wc -c < /tmp/uc16-del-body.$$ | tr -d ' ')"
  rm -f /tmp/uc16-del-body.$$
  uc16_row=$(echo "SELECT name || '|' || (\"deletedAt\" IS NOT NULL) FROM products.products WHERE \"productId\" = '$uc16_id';" | sql | tr -d '\r')
  check "Contrato UC16: o registro continua no banco com o mesmo nome e deletedAt preenchido" "$uc16_name|true" "$uc16_row"
  uc16_deleted_at=$(echo "SELECT \"deletedAt\" FROM products.products WHERE \"productId\" = '$uc16_id';" | sql | tr -d '\r')
  check "Contrato UC16: buscar o removido retorna 404" "404" "$(status "$BASE/products/$uc16_id")"
  check "Contrato UC16: alterar o removido retorna 404" "404" "$(status -X PUT "$BASE/products/$uc16_id" -H "Content-Type: application/json" -d '{"name":"x"}')"
  del_again_body=$(curl -s -X DELETE "$BASE/products/$uc16_id")
  check "Contrato UC16: remover de novo retorna 404 ProductNotFoundException" "ProductNotFoundException" "$(extract_json_field "$del_again_body" "error")"
  uc16_deleted_at_after=$(echo "SELECT \"deletedAt\" FROM products.products WHERE \"productId\" = '$uc16_id';" | sql | tr -d '\r')
  check "Contrato UC16: a segunda remoção preserva o deletedAt original" "$uc16_deleted_at" "$uc16_deleted_at_after"
  uc16_total_after=$(curl -s "$BASE/products?limit=1" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).total)}catch{console.log('')}})")
  check "Contrato UC16: o total da listagem diminuiu em 1" "$((uc16_total_before - 1))" "$uc16_total_after"
  if [ -n "$created_id" ]; then
    check "Contrato UC16: outro produto ativo não foi afetado (GET retorna 200)" "200" "$(status "$BASE/products/$created_id")"
  fi
else
  check "Contrato UC16: remoção requer produto cadastrado" "id_valido" "id_vazio"
fi
code_del_missing=$(status -X DELETE "$BASE/products/99999999-9999-4999-8999-999999999999")
check "Contrato UC16: DELETE em UUID sem produto retorna 404" "404" "$code_del_missing"
code_del_bad_id=$(status -X DELETE "$BASE/products/abc")
check "Contrato UC16: DELETE com identificador que não é UUID retorna 400" "400" "$code_del_bad_id"
code_del_subroute=$(status -X DELETE "$BASE/products/99999999-9999-4999-8999-999999999999/extra")
check "Contrato UC16: DELETE em sub-rota inexistente retorna 404" "404" "$code_del_subroute"

code_wrong_route=$(status -X POST "$BASE/produtos" -H "Content-Type: application/json" -d '{"name":"x"}')
check "Contrato: POST em rota inexistente retorna 404" "404" "$code_wrong_route"

# Descarte de propriedade extra (whitelist)
extra_response=$(curl -s -X POST "$BASE/products" -H "Content-Type: application/json" -d "{\"name\":\"Produto Whitelist $timestamp\",\"campoExtra\":\"descartar\"}")
extra_field=$(extract_json_field "$extra_response" "campoExtra")
if [ -z "$extra_field" ]; then
  check "Propriedade extra descartada pelo ValidationPipe (whitelist)" "descartado" "descartado"
else
  check "Propriedade extra descartada pelo ValidationPipe (whitelist)" "descartado" "presente"
fi

# ------------------------------------------------------------------------------
# 5. Recursos de apoio sem seed: POST /orders/:id/confirm
# ------------------------------------------------------------------------------
echo
echo "--- 5. Recurso de Apoio: Orders (Fronteira HTTP sem Seed) ---"
code_order_invalid_id=$(status -X POST "$BASE/orders/abc/confirm")
check "Confirmação de pedido com ID inválido retorna 400" "400" "$code_order_invalid_id"

code_order_not_found=$(status -X POST "$BASE/orders/00000000-0000-0000-0000-000000000000/confirm")
check "Confirmação de pedido com UUID inexistente retorna 404" "404" "$code_order_not_found"

# ------------------------------------------------------------------------------
# 6. Banco: o registro criado existe com os dados enviados
# ------------------------------------------------------------------------------
echo
echo "--- 6. Verificação de Persistência Direta no PostgreSQL ---"
if [ -z "$created_id" ]; then
  check "Consulta SQL de persistência do produto criado" "id_valido" "id_vazio"
else
  db_record_name=$(echo "SELECT name FROM products.products WHERE \"productId\" = '$created_id';" | sql | tr -d '\r')
  check "Registro do produto criado persistido no banco com nome correto" "$product_name" "$db_record_name"
fi

# ------------------------------------------------------------------------------
# 7. Durabilidade (somente com --durability e se houver identificador)
# ------------------------------------------------------------------------------
if [ "$DURABILITY" -eq 1 ]; then
  echo
  echo "--- 7. Teste de Durabilidade: Reiniciar API e Revalidar Registro ---"
  if [ -z "$created_id" ]; then
    check "Execução de durabilidade requer identificador válido" "id_valido" "id_vazio"
  else
    echo "Reiniciando SOMENTE o contêiner da API (docker compose restart api)..."
    docker compose restart api >/dev/null 2>&1

    echo "Aguardando API retornar à disponibilidade (até 30 tentativas)..."
    ready=0
    for i in $(seq 1 30); do
      curr_status=$(status "$BASE/" || true)
      if [ "$curr_status" = "200" ]; then
        ready=1
        break
      fi
      sleep 1
    done

    check "API reiniciada e respondendo 200 em GET /" "1" "$ready"

    db_durable_name=$(echo "SELECT name FROM products.products WHERE \"productId\" = '$created_id';" | sql | tr -d '\r')
    check "Registro do produto permanece íntegro após restart da API" "$product_name" "$db_durable_name"
  fi
fi

# ------------------------------------------------------------------------------
# Encerramento
# ------------------------------------------------------------------------------
echo
echo "================================================================================"
echo "Resultado: $pass ok, $fail falha(s)"
echo "================================================================================"

[ "$fail" -eq 0 ]
