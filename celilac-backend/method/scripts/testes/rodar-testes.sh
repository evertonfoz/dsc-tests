#!/usr/bin/env bash
# Testa o validador check-state com fixtures (sem rede, sem GitHub).
# Cada caso inválido deve falhar (exit 1) e conter a mensagem esperada.
set -uo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHK="$DIR/../check-state.mjs"
FX="$DIR/fixtures"
falhas=0

ok()   { echo "  PASSOU  $1"; }
fail() { echo "  FALHOU  $1"; falhas=$((falhas+1)); }

# modelo oficial deve ser aceito (Fase A, epic.issue ainda null)
if out=$(node "$CHK" "$DIR/../../templates/state.yaml" 2>&1); then ok "templates/state.yaml é aceito"; else fail "templates/state.yaml deveria ser aceito"; echo "$out"; fi

# válido
if out=$(node "$CHK" "$FX/valido.yaml" 2>&1); then ok "valido.yaml é aceito"; else fail "valido.yaml deveria ser aceito"; echo "$out"; fi

# inválidos: arquivo|trecho esperado
casos=(
  "inv-arquetipo|arquetipo inválido"
  "inv-criterio-formato|identificador inválido"
  "inv-documento-inexistente|documento: arquivo não encontrado"
  "inv-pr-faltando|exige pr"
  "inv-issue-duplicada|já usada pela fatia"
  "inv-evidencia-inexistente|arquivo não encontrado"
  "inv-fase-salto|não está concluída"
  "inv-gate-sem-por|exige \"por\""
  "inv-epic-fechada|Epic fechada"
  "inv-epic-sem-issue|epic.issue é obrigatório"
  "inv-sintaxe|ERRO de leitura"
)
for c in "${casos[@]}"; do
  f="${c%%|*}"; msg="${c#*|}"
  out=$(node "$CHK" "$FX/$f.yaml" 2>&1); code=$?
  if [[ $code -eq 1 && "$out" == *"$msg"* ]]; then ok "$f rejeitado com \"$msg\""
  else fail "$f (exit=$code, esperava trecho \"$msg\")"; echo "$out" | sed 's/^/      /'; fi
done

# ---- verificador de links (check-links) ----
LNK="$DIR/../check-links.mjs"
RAIZ="$DIR/../../.."
LFX="$DIR/fixtures-links"
if out=$(node "$LNK" --root "$RAIZ" "$LFX/ok.md" "$LFX/alvo.md" 2>&1); then ok "check-links aceita documento sem referências quebradas"; else fail "ok.md deveria passar"; echo "$out"; fi
for caso in "quebrado-link.md|link inexistente: guia-que-nao-existe.md" "quebrado-caminho.md|caminho inexistente: prompts/uc-12.md" "quebrado-caminho.md|caminho inexistente: src/nao/existe.ts"; do
  f="${caso%%|*}"; msg="${caso#*|}"
  out=$(node "$LNK" --root "$RAIZ" "$LFX/$f" 2>&1); code=$?
  if [[ $code -eq 1 && "$out" == *"$msg"* ]]; then ok "check-links rejeita $f: \"$msg\""; else fail "$f (exit=$code, esperava \"$msg\")"; echo "$out" | sed 's/^/      /'; fi
done
# escopo padrão do projeto deve estar limpo
if out=$(cd "$RAIZ" && node method/scripts/check-links.mjs 2>&1); then ok "check-links: escopo padrão do projeto sem referências quebradas"; else fail "escopo padrão com referências quebradas"; echo "$out" | sed 's/^/      /'; fi

echo
if [[ $falhas -eq 0 ]]; then echo "Todos os testes do validador passaram."; else echo "$falhas teste(s) falharam."; exit 1; fi
