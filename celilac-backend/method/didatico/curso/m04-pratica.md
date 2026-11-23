---
id: m04-pratica
tipo: pratica
titulo: "Prática do módulo 4"
pratica_de: m04
---

# Prática do módulo 4

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 6. Pratique no seu domínio
Nesta ordem (a ordem importa):
1. Abra uma issue de fundação e uma branch `chore/<resumo>`.
2. **Perfil do projeto:** copie `method/templates/project-profile.md` e preencha com os comandos reais.
3. **Compose sem segredos**, com `.env.example` (apoio D).
4. **Banco de testes isolado**, com as três travas, e um teste que prove que ele **recusa** rodar contra o banco de desenvolvimento.
5. **Script de verificação** que roda lint, build e testes.
6. **CI** que chama o script (apoio C).
7. **Valide em cópia limpa** (seção 4.3) e só então abra o PR.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Perfil, banco de testes protegido, script de verificação, CI e validação em cópia limpa.

**Onde:** `project-profile.md`, `.env.example`, Compose, script de verificação e workflow nos caminhos de fundação do projeto; execuções em `docs/uc/<uc>/evidencias/A/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
