# Apoio C — Integração contínua (CI): um robô que confere por você

> **Para quem:** quem nunca configurou verificações automáticas no GitHub. Duração sugerida: 2 aulas.
> **Pré-requisito:** apoios A e B e o módulo 3 (a `main` vermelha).
> **Você vai:** ler um fluxo de verificação real, montar um mínimo no seu projeto e aprender a interpretar quando ele fica vermelho.

---

## 1. O problema
No módulo 3 você viu a `main` com um teste falhando depois do PR #12 (PR, *pull request*, a proposta de mudança no GitHub). **Nada impediu isso.** Não havia nenhum robô conferindo: a integração dependia de alguém lembrar de rodar os testes, e de ter lido o resultado.

Esse é o problema do "na minha máquina funciona". Quando a verificação depende de uma pessoa, ela é esquecida, feita de forma diferente em cada máquina, ou feita com versões e dados que só existem ali.

## 2. Antes de ler a solução
Liste, em um papel, **tudo o que você faz antes de dar `git push`** (rodar testes, rodar o linter, compilar...). Depois responda:
1. Quantos desses passos você realmente fez na última vez?
2. Algum depende de algo que só existe no seu computador (um arquivo `.env`, um banco já populado, uma versão específica do Node)?
3. Se um colega entrar no projeto amanhã, ele sabe todos esses passos?

## 3. A tentativa ingênua
**"Vou lembrar de rodar tudo antes do push."** Falha por três razões independentes: esquecimento, diferença entre máquinas e ausência de registro de que a verificação foi feita.

## 4. A solução: integração contínua
CI (*Continuous Integration*, integração contínua) é um servidor que **roda as suas verificações a cada mudança enviada ao repositório**, em um ambiente limpo e sempre igual, e mostra o resultado no PR. Neste curso usamos o **GitHub Actions**, o serviço de CI do próprio GitHub.

Dois conceitos para guardar:
- **Verificação (*check*):** um conjunto de passos que termina em verde (passou) ou vermelho (falhou).
- **Ambiente limpo:** o robô começa de uma máquina virtual nova, sem os seus arquivos locais. Se algo só funciona com o seu `.env`, ali ele falha e **mostra o problema**.

### 4.1. A anatomia de um fluxo
O fluxo fica em `.github/workflows/` e é escrito em YAML (formato de texto para dados estruturados, o mesmo do `state.yaml` do módulo 2). Um trecho real do CeliLac, em `.github/workflows/celilac-backend-ci.yml`:

```yaml
name: celilac-backend CI

on:
  pull_request:
    paths:
      - 'celilac-backend/**'
  push:
    branches: [main]

jobs:
  quality:
    name: Qualidade (lint, build, testes rápidos, método)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Instalar dependências (lockfile congelado)
        run: pnpm install --frozen-lockfile
      - name: Verificação
        run: bash scripts/verify.sh
```

| Parte | O que significa |
|---|---|
| `name` | o nome do fluxo, mostrado no GitHub |
| `on` | **quando** roda: aqui, a cada PR que mexe em `celilac-backend/` e a cada push na `main` |
| `jobs` | os blocos de trabalho; cada *job* roda em uma máquina própria, em paralelo |
| `runs-on` | o sistema da máquina (`ubuntu-latest` é um Linux) |
| `steps` | os passos do job, em ordem |
| `uses` | reaproveita uma ação pronta (aqui, baixar o código) |
| `run` | executa um comando de terminal |

`--frozen-lockfile` manda instalar **exatamente** as versões do arquivo de bloqueio (`pnpm-lock.yaml`), para o robô e a sua máquina usarem as mesmas dependências.

### 4.1.1. Onde fica a pasta `.github`
A pasta `.github` fica **sempre na raiz do repositório Git**, ao lado de `src/`, e não dentro de uma subpasta. No CeliLac ela está em `dsc-tests/.github`, um nível acima da pasta `celilac-backend/` (por isso ela não aparece se você abrir só `celilac-backend` no editor).

Esse repositório guarda **dois projetos lado a lado**, e é por isso que o fluxo real tem duas linhas que você **não** deve copiar sem pensar: `paths: 'celilac-backend/**'` (roda só quando esse projeto muda) e `working-directory: celilac-backend` (entra na pasta do projeto antes dos comandos). Se o seu repositório tem um projeto só, o fluxo roda na raiz e essas duas linhas não existem. O exemplo mínimo da seção 6 já está assim.

### 4.2. Por que três jobs
O CeliLac tem três, e cada um responde a uma pergunta diferente:

| Job | Pergunta | O que roda |
|---|---|---|
| Qualidade | O código está correto e consistente? | lint (análise estática que aponta erros e inconsistências de estilo), build (compilação), testes rápidos, verificação do `state.yaml` e dos links dos documentos |
| Integração e E2E | Funciona com o banco real? | um PostgreSQL descartável, criado só para o job, e os testes de integração e E2E (*end-to-end*, de ponta a ponta) |
| Smoke do Compose | O sistema sobe em contêineres e responde? | sobe a API e o banco com Docker (apoio D) e roda o script de verificação HTTP |

*Smoke* (fumaça) é um teste rápido que só confirma que "liga e responde".

### 4.3. Segredos: o robô não pode ter senhas fixas no arquivo
O banco do job de integração usa uma senha **descartável** (`ci-only-throwaway-password`): ele existe só durante o job e não é acessível de fora. No job do Compose, as senhas são **geradas na hora** com `openssl rand -hex 16`. **Nunca** coloque uma senha real em um arquivo do repositório. Para segredos reais, o GitHub tem um cofre próprio (*secrets*), que não é assunto deste módulo.

## 5. Como ler uma falha
No PR, a lista de verificações mostra cada job em verde ou vermelho. Para investigar:
1. Clique no job vermelho e abra o passo que falhou.
2. Leia **a primeira** mensagem de erro, não a última.
3. Reproduza no seu terminal com o **mesmo comando** do passo.

Pelo terminal, com a ferramenta `gh` (apoio A):
```bash
gh pr checks 26          # situação de cada job do PR 26
gh run list --limit 5    # as últimas execuções
```

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

## 7. Como saber que funcionou
- [ ] O fluxo roda sozinho a cada PR.
- [ ] Já vi o job ficar vermelho e verde pelo motivo certo.
- [ ] Sei reproduzir no meu terminal o comando do passo que falhou.
- [ ] Não há senha real em nenhum arquivo do repositório.

## 8. Armadilhas comuns (todas ocorreram no piloto)
- **Erro de YAML.** Um nome de passo com `: ` sem aspas fez o GitHub recusar o fluxo inteiro. Valide a sintaxe antes de enviar.
- **O CI pega o que você esqueceu.** Em dois PRs, a verificação de links dos documentos falhou porque faltava o prefixo `docs/uc/uc12/` em um caminho citado. Foi o robô que avisou, não uma pessoa.
- **Teste instável (*flaky*).** Um teste que falha às vezes, sem mudança no código, pode derrubar o CI por acaso. No CeliLac isso está registrado como a issue #27 e continua sem causa conhecida. A resposta correta é **registrar**, e não apagar o teste.
- **Verde por exclusão.** Alguns testes do módulo `orders` são exercícios de aula que falham de propósito; o CI os **exclui** e isso está explícito na ADR-001 (ADR, *Architecture Decision Record*, registro de decisão). "CI verde" com exclusões só é honesto se as exclusões estiverem escritas.
- **CI verde não significa correto.** Significa que as verificações **que existem** passaram. Se não há teste para a regra, o verde não diz nada sobre ela.

## 9. Como lidar com a IA (inteligência artificial) neste módulo
A IA escreve o fluxo rapidamente. Confira três coisas:
1. **Rode você mesmo.** Abra o PR e veja o resultado real; a descrição do que "deve acontecer" não vale.
2. **Nunca aceite "para o CI passar, desativei o teste".** Desativar uma verificação para ficar verde esconde o problema. Se há exclusões, peça que ela as registre em uma ADR.
3. **Segredos.** Peça que **nunca** escreva senhas reais no arquivo, e releia o diff antes de confirmar.

Próximo: apoio D (contêineres) e módulo 4.
