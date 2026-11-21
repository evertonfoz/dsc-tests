#!/usr/bin/env bash
# Constrói a imagem da aplicação do curso a partir do commit atual do dsc-tests.
# Uso: curso-app/scripts/construir.sh   (de qualquer pasta dentro do repositório)
set -euo pipefail

raiz="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
cd "$raiz"

commit="$(git rev-parse HEAD)"
data="$(git show -s --format=%cI HEAD)"

# O rodapé mostra o commit; se há mudanças não commitadas no que entra na imagem, ele não descreve o conteúdo.
if [ -n "$(git status --porcelain -- curso-app celilac-backend/method/didatico/curso)" ]; then
  echo "Aviso: há mudanças não commitadas em curso-app/ ou no curso; o rodapé mostrará o commit ${commit:0:7}, que não as contém." >&2
fi

docker build -f curso-app/Dockerfile \
  --build-arg ORIGEM_COMMIT="$commit" \
  --build-arg ORIGEM_DATA="$data" \
  -t curso-app:local \
  "$@" \
  .
echo "Imagem curso-app:local construída com o commit ${commit:0:7}. Para executar: curso-app/scripts/executar.sh"
