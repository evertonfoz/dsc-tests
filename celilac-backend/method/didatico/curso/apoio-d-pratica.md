---
id: apoio-d-pratica
tipo: pratica
titulo: "Prática do Apoio D"
pratica_de: apoio-d
---

# Prática do Apoio D

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 5. Pratique no seu domínio
1. Escreva um `compose.yaml` com **um** serviço de banco (a imagem e a versão que o seu projeto usa), com volume e `healthcheck`.
2. Crie o `.env.example` (sem segredos) e o seu `.env` (ignorado pelo Git; confira o `.gitignore`).
3. Suba com `docker compose up -d` e confira com `docker compose ps` até aparecer **healthy**.
4. Conecte a sua aplicação ao banco do contêiner.
5. Pare com `docker compose stop`, suba de novo e confirme que **os dados continuam lá**.
6. Remova o `DB_PASSWORD` do `.env` e rode: leia a mensagem de erro.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Compose, `.env.example`, `.env` ignorado pelo Git e verificação de persistência.

**Onde:** `compose.yaml`, `.env.example` e `.gitignore` na raiz; `.env` local ignorado; saídas em `docs/uc/<uc>/evidencias/A/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
