---
id: m08-pratica
tipo: pratica
titulo: "Prática do módulo 8"
pratica_de: m08
---

# Prática do módulo 8

> Esta prática orienta o trabalho no repositório do aluno. Os exemplos do curso são referência; não são saídas desta execução.

## 8. Pratique no seu domínio
1. Liste a(s) tabela(s) do seu caso de uso: colunas, tipos, o que é obrigatório, o que tem limite.
2. Escreva a **migration** (`up` e `down`) e **leia-a em voz alta** comparando com a sua lista.
3. Escreva a **entidade do ORM** e o **mapper**.
4. Implemente o **adaptador** da interface do repositório que você criou no módulo 5. As regras de negócio **não** podem mudar.
5. Escreva dois testes com banco real:
   - persistir e **conferir por SQL**;
   - uma falha real do banco (a do módulo 6), conferindo que o cliente continua sem ver o texto do banco.
6. Garanta as **travas** da seção 6 antes de qualquer `TRUNCATE` ou apagamento.
7. Mostre a prova do "banco vazio" **sem apagar o seu banco**: use o CI, ou um banco novo criado só para isso.
8. **Mutação** (módulo 7): remova uma coluna do mapper (por exemplo, não grave o nome). O teste da etapa 5 precisa falhar. Guarde a saída.

## Entregas, localização e conferência

Faça as atividades no seu repositório. Guarde os documentos de trabalho junto ao caso de uso, nos caminhos indicados abaixo; guarde saídas reais em `docs/uc/<uc>/evidencias/<fase>/`. Se o diretório ainda não existir, crie-o no seu projeto. Para cada saída, use [o modelo de evidência de comando](../../templates/evidencia-de-comando.md) e preencha com os dados da sua execução. Não copie resultados deste curso como se fossem seus.

**O que produzir:** Migration, entidade, mapper, adaptador, testes de banco e mutação revertida.

**Onde:** migrations, entidade, mapper, adaptador e testes nos diretórios existentes do projeto; saídas em `docs/uc/<uc>/evidencias/C/`.

**Como conferir:** abra os arquivos produzidos e compare-os com os critérios da seção “Como saber que funcionou” do módulo de origem. Para evidências de comando, confira que o conteúdo veio do terminal/CI e identifica comando, data/hora UTC, commit base e saída integral pertinente. Quando a atividade pedir um comando de validação, use o caminho e o comando reais do seu projeto, confira o código de saída e registre a execução; não trate um exemplo ou esta instrução como execução feita.
