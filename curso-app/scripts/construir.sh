#!/usr/bin/env bash
# Constrói a imagem da aplicação do curso a partir do commit atual do dsc-tests.
# Uso: curso-app/scripts/construir.sh   (de qualquer pasta dentro do repositório)
set -euo pipefail

raiz="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$raiz"

commit="$(git rev-parse HEAD)"
data="$(git show -s --format=%cI HEAD)"

# O rodapé mostra o commit; se há mudanças não commitadas no que entra na imagem, ele não descreve o conteúdo.
if [ -n "$(git status --porcelain -- curso-app celilac-backend/method/didatico/curso celilac-backend/docs/uc/uc12 celilac-backend/docs/planejamento/uc12-cadastrar-produto/uc-12.md)" ]; then
  echo "Aviso: há mudanças não commitadas na aplicação ou no conteúdo que ela publica; o rodapé mostrará o commit ${commit:0:7}, que não as contém." >&2
fi

# Commits citados no curso têm de existir no histórico (E8, P7). Fica fora do Docker, que não recebe o .git.
node curso-app/scripts/conferir-commits.mjs

docker build -f curso-app/Dockerfile \
  --build-arg ORIGEM_COMMIT="$commit" \
  --build-arg ORIGEM_DATA="$data" \
  -t curso-app:local \
  "$@" \
  .
echo "Imagem curso-app:local construída com o commit ${commit:0:7}. Para executar: curso-app/scripts/executar.sh"
