---
id: apoio-c-pratica
tipo: pratica
titulo: "Prática do Apoio C"
pratica_de: apoio-c
---

# Prática do Apoio C

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
1. No seu projeto, crie a pasta `.github`, dentro dela a pasta `workflows` e nela o arquivo `ci.yml`. Escreva um fluxo mínimo (adapte à sua linguagem):
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  qualidade:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Instalar dependências
        run: pnpm install --frozen-lockfile
      - name: Testes
        run: pnpm test
```
2. Faça um PR e veja o job ficar **verde**.
3. **Quebre de propósito**: altere um teste para que falhe, envie e veja o job ficar **vermelho**. Leia o erro no GitHub.
4. Conserte e confirme o verde.
5. Acrescente um passo de lint e outro de build.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Workflow de CI no repositório do aluno e execuções reais verde, vermelha e verde.

**Onde:** `.github/workflows/ci.yml` (ou o caminho de workflow adotado pelo projeto); links/execuções do CI em `docs/uc/<uc>/evidencias/A/`. <!-- links:ignore -->

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
