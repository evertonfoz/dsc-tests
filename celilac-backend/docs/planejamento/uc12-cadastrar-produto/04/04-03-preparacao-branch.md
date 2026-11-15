# ARTEFATO 04-03 — PREPARAÇÃO E RASTREAMENTO DA BRANCH DE TRABALHO

> **Material 04 — Desenvolvimento Colaborativo: Branches, Pull Requests e Revisão Técnica**  
> **Caso de Uso:** `UC12 — Cadastrar Produto`  
> **Sistema:** CeliLac (Backend API)  
> **Data de Emissão:** 10/11/2026

---

## 1. Identificação da Atividade e Nomenclatura da Branch

- **Issue Relacionada:** `SUB-07 — [UC12][Testes] Implementar testes automatizados para o cadastro de produto` (GitHub Issue [#10](https://github.com/evertonfoz/dsc-tests/issues/10)).
- **Issue Principal Vinculada:** `EPIC-UC12 — [UC12] Cadastrar Produto` (GitHub Issue [#1](https://github.com/evertonfoz/dsc-tests/issues/1)).
- **Nome da Branch de Trabalho:** `feature/uc12-07-product-registration-test`
- **Padrão de Convenção Adotado:** `feature/<caso-de-uso>-<numero-sub-issue>-<descricao-curta-em-ingles>`
- **Branch de Origem (Base):** `main` (commit base `cb70436`).

---

## 2. Procedimento de Criação e Rastreamento Remoto (Upstream)

Para garantir isolamento rigoroso em relação à `main` e publicação transparente no GitHub, a branch de trabalho foi ramificada a partir do ponto estável da `main` e conectada ao seu upstream remoto.

### 2.1 Comandos Executados

```bash
# 1. Garantir que a base está na main atualizada
git switch main
git pull --ff-only origin main

# 2. Criar e alternar para a branch de trabalho
git switch -c feature/uc12-07-product-registration-test

# 3. Publicar e configurar o rastreamento remoto (upstream)
git push -u origin feature/uc12-07-product-registration-test
```

---

## 3. Evidências de Verificação Técnica

### 3.1 Verificação da Branch Ativa
```bash
$ git branch --show-current
feature/uc12-07-product-registration-test
```

### 3.2 Verificação da Conexão com o Upstream Remoto
```bash
$ git branch -vv | grep feature/uc12-07-product-registration-test
* feature/uc12-07-product-registration-test 2724b97 [origin/feature/uc12-07-product-registration-test] test: add failing product creation test (refs #10)
```

### 3.3 Verificação de Isolamento
```bash
$ git status
On branch feature/uc12-07-product-registration-test
Your branch is up to date with 'origin/feature/uc12-07-product-registration-test'.
nothing to commit, working tree clean
```

---

## 4. Conceito Técnico Aplicado: Ramificação e Upstream

- **Isolamento de Trabalho:** O uso de `git switch -c` assegura que nenhuma alteração de código ou teste impacte os demais integrantes ou a estabilidade da `main`.
- **Rastreamento de Upstream (`-u` / `--set-upstream`):** Conecta a branch local `feature/uc12-07-product-registration-test` à sua contraparte no GitHub `origin/feature/uc12-07-product-registration-test`, permitindo comandos simplificados `git push` e `git pull`, além de viabilizar a abertura imediata do Draft Pull Request.

