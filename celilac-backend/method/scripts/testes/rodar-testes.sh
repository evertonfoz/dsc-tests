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

# fase B reaberta com fase posterior em andamento (ADR-004 do método) é aceita
if out=$(node "$CHK" "$FX/reaberta-valida.yaml" 2>&1); then ok "reaberta-valida.yaml é aceito (retorno a fase anterior)"; else fail "reaberta-valida.yaml deveria ser aceito"; echo "$out"; fi

# PR compartilhado por várias fatias, declarado em todas (ADR-005 do método), é aceito
if out=$(node "$CHK" "$FX/pr-compartilhado-valido.yaml" 2>&1); then ok "pr-compartilhado-valido.yaml é aceito"; else fail "pr-compartilhado-valido.yaml deveria ser aceito"; echo "$out"; fi

# inválidos: arquivo|trecho esperado
casos=(
  "inv-arquetipo|arquetipo inválido"
  "inv-criterio-formato|identificador inválido"
  "inv-documento-inexistente|documento: arquivo não encontrado"
  "inv-pr-faltando|exige pr"
  "inv-issue-duplicada|já usada pela fatia"
  "inv-pr-compartilhado-nao-declarado|declare pr_compartilhado: true"
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

# ---- núcleo do validador (check-state-core), usado também fora do Node ----
CORE="$DIR/../check-state-core.mjs"
if grep -qE "from ['\"]node:|require\(" "$CORE"; then fail "check-state-core.mjs não deve importar módulos do Node"; else ok "check-state-core.mjs sem módulos do Node"; fi
# sem `existe`: estrutura validada, arquivos não conferidos e listados como caminhos
if out=$(node --input-type=module -e "
  import { readFileSync } from 'node:fs';
  import { parseYaml, validar } from '$CORE';
  const r = validar(parseYaml(readFileSync('$FX/inv-evidencia-inexistente.yaml', 'utf8')));
  if (r.erros.length !== 0) { console.log(r.erros.join('\n')); process.exit(1); }
  if (!r.caminhos.some((c) => c.caminho.includes('nao-existe') || c.caminho.includes('inexistente'))) { console.log(JSON.stringify(r.caminhos)); process.exit(1); }
" 2>&1); then ok "núcleo sem \"existe\": não confere arquivos e lista os caminhos"; else fail "núcleo sem \"existe\""; echo "$out" | sed 's/^/      /'; fi
# com `existe` que responde não: mesmo erro do terminal
if out=$(node --input-type=module -e "
  import { readFileSync } from 'node:fs';
  import { parseYaml, validar } from '$CORE';
  const r = validar(parseYaml(readFileSync('$FX/valido.yaml', 'utf8')), { existe: () => false });
  if (!r.erros.some((e) => e.includes('arquivo não encontrado'))) process.exit(1);
" 2>&1); then ok "núcleo com \"existe\" falso: acusa arquivo não encontrado"; else fail "núcleo com \"existe\" falso"; echo "$out" | sed 's/^/      /'; fi
# erro de estrutura continua sendo detectado sem `existe`
if out=$(node --input-type=module -e "
  import { readFileSync } from 'node:fs';
  import { parseYaml, validar } from '$CORE';
  const r = validar(parseYaml(readFileSync('$FX/inv-arquetipo.yaml', 'utf8')));
  if (!r.erros.some((e) => e.includes('arquetipo inválido'))) process.exit(1);
" 2>&1); then ok "núcleo sem \"existe\": continua rejeitando estrutura inválida"; else fail "núcleo sem \"existe\" deveria rejeitar inv-arquetipo"; echo "$out" | sed 's/^/      /'; fi

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
