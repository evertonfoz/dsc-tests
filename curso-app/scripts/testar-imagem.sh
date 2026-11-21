#!/usr/bin/env bash
# Testes de fumaça da imagem construída (plano do M0, seção 7: critérios 2, 3 e 4).
# Uso: curso-app/scripts/testar-imagem.sh <commit-esperado> [imagem]
set -euo pipefail

commit="${1:?informe o commit esperado no rodapé}"
imagem="${2:-curso-app:local}"
nome="curso-app-teste-$$"
falhas=0

ok()    { echo "OK    $*"; }
falha() { echo "FALHA $*"; falhas=$((falhas + 1)); }

limpar() { docker rm -f "$nome" >/dev/null 2>&1 || true; }
trap limpar EXIT

# Critério 3: sem Node e sem código-fonte na imagem final.
if docker run --rm --entrypoint sh "$imagem" -c 'command -v node' >/dev/null 2>&1; then
  falha "(3) a imagem final contém node"
else
  ok "(3) a imagem final não contém node"
fi
fontes="$(docker run --rm --entrypoint sh "$imagem" -c \
  'find / -xdev \( -name "*.md" -o -name "*.ts" -o -name "*.astro" -o -name node_modules -o -name package.json \) -not -path "/proc/*" 2>/dev/null; true')"
if [ -n "$fontes" ]; then
  falha "(3) arquivos de código-fonte na imagem: $(echo "$fontes" | head -5 | tr '\n' ' ')"
else
  ok "(3) nenhum .md, .ts, .astro, package.json ou node_modules na imagem final"
fi

# Critério 4: publicado só em 127.0.0.1:4321 (mesmas opções de executar.sh).
docker run -d --name "$nome" --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
  -p 127.0.0.1:4321:8080 "$imagem" >/dev/null
for _ in $(seq 1 30); do
  curl -fsS -o /dev/null http://127.0.0.1:4321/ 2>/dev/null && break
  sleep 0.5
done
portas="$(docker port "$nome")"
if [ "$portas" = "8080/tcp -> 127.0.0.1:4321" ]; then
  ok "(4) porta publicada: $portas"
else
  falha "(4) porta publicada inesperada: $portas"
fi
if curl -fsS -o /dev/null http://127.0.0.1:4321/; then ok "(4) http://127.0.0.1:4321/ responde"; else falha "(4) http://127.0.0.1:4321/ não responde"; fi
ip_rede="$( (hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || true) | awk '{print $1}')"
if [ -n "$ip_rede" ]; then
  if curl -fsS -m 3 -o /dev/null "http://$ip_rede:4321/" 2>/dev/null; then
    falha "(4) responde também no endereço de rede $ip_rede"
  else
    ok "(4) não responde no endereço de rede $ip_rede"
  fi
else
  echo "A CONFIRMAR (4) endereço de rede não encontrado; teste fora do 127.0.0.1 não executado"
fi

# Critério 2: rodapé com o commit em todas as páginas do M0.
for pagina in / /m00/; do
  html="$(curl -fsS "http://127.0.0.1:4321$pagina")"
  if grep -q "data-origem-commit=\"$commit\"" <<<"$html" && grep -q "Conteúdo do commit ${commit:0:7} (" <<<"$html"; then
    ok "(2) $pagina mostra o commit ${commit:0:7} e a data"
  else
    falha "(2) $pagina não mostra o commit $commit"
  fi
done

# Redirecionamento relativo (porta interna 8080 não vaza) e política de segurança.
local_redir="$(curl -sS -o /dev/null -w '%{redirect_url}' http://127.0.0.1:4321/m00)"
case "$local_redir" in
  http://127.0.0.1:4321/m00/) ok "/m00 redireciona para /m00/ na mesma porta" ;;
  *) falha "/m00 redireciona para '$local_redir'" ;;
esac
if curl -fsSI http://127.0.0.1:4321/ | grep -qi "^content-security-policy: default-src 'self'"; then
  ok "política de segurança de conteúdo presente"
else
  falha "política de segurança de conteúdo ausente"
fi

echo "---"
if [ "$falhas" -gt 0 ]; then echo "$falhas falha(s)."; exit 1; fi
echo "Todos os testes da imagem passaram."
