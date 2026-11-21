---
id: m08-gabarito
tipo: gabarito
titulo: 'Gabarito do professor — Módulo 8'
gabarito_de: [m08]
---

# Gabarito do professor — Módulo 8

> Uso exclusivo do professor.

## Seção 2 (lista dos alunos)
Respostas esperadas (basta cobrir cinco): tamanho máximo de coluna; `NOT NULL`; caracteres que o banco recusa (NUL); tipo (uuid inválido); a tabela/esquema precisa existir; chave primária duplicada; conexão indisponível; ordem das migrations; diferença entre a representação do domínio e a da tabela; conferir a gravação por fora do repositório.

## Verificações feitas na preparação
- `synchronize: false` em `src/app.module.ts`, `src/database/data-source.ts` e `src/database/test-data-source.ts`.
- O módulo de produtos fornece `TypeOrmProductsRepository` para `PRODUCTS_REPOSITORY`; a interface tem só `save`.
- O log de "banco vazio" é o de `docs/uc/uc12/evidencias/C/c2-migration-banco-vazio.txt` (3 migrations novas).
- O teste real de banco usa `TRUNCATE` em `beforeEach`, protegido pelas travas descritas.

## Exercícios
1. Leitura pelo mesmo repositório faz com que um erro de mapeamento (ex.: não gravar `name`) apareça igual nos dois lados e passe. O SQL direto é independente.
2. Prova que o banco **começou vazio** e a estrutura nasce só das migrations; na máquina do aluno, tabelas antigas podem esconder uma migration faltando.
3. `down` apaga a tabela e o esquema; em banco com dados reais perde-se tudo.
4. Um teste que consulta `information_schema.columns` (`character_maximum_length`) da coluna `name` e compara com `MAX_PRODUCT_NAME_LENGTH`. **Não existe hoje** no repositório; o aluno está propondo algo novo.
5. Resposta livre: tamanho, `NOT NULL`, unicidade, tipo, caracteres.

## Pontos de atenção
- A seção 7 descreve uma dívida **real** e declarada: o limite em três lugares, sem teste de consistência. Não afirmar que o método a resolve.
- A afirmação de que "o `down` não é para ser rodado em qualquer banco" é prática do projeto (proibições do método), não regra do TypeORM.
- Verificar se o aluno realmente **viu uma trava falhar** (item do "Como saber que funcionou"): é fácil marcar sem fazer.
- Prática 7: se o aluno não tiver CI, aceitar um banco novo criado só para o teste (um contêiner descartável), desde que **não** apague o banco de trabalho.
- Mutação (prática 8): se o aluno remover a coluna `name` do mapper e o teste continuar passando, o teste lê pelo repositório ou não confere o nome; é o diagnóstico da seção 4.3.

## Sinais de que o aluno não entendeu
- Liga `synchronize` para "resolver" o erro de tabela inexistente.
- Edita uma migration já aplicada em vez de criar outra.
- Apaga o próprio banco para "provar" o banco vazio.
- Diz que a persistência está pronta com testes só em memória.
