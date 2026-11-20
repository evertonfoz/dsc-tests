# Módulo 8 — Como persistir de verdade?

> **Pré-requisito:** módulos 4 a 7 e apoio D (contêineres). Duração sugerida: 2 a 3 aulas.
> **Você vai:** trocar o repositório "de mentira" (em memória) por um que grava em um banco real, e provar que o dado **realmente** foi gravado e que o banco **do zero** fica com a estrutura certa.

---

## 1. O problema
Até o módulo 7, o cadastro de produto funcionava, mas **gravava em uma lista na memória** (o repositório em memória, `InMemoryProductsRepository`). Os testes passavam, a API (*Application Programming Interface*, a interface pela qual outros programas usam o sistema) respondia 201. Só que:

- ao reiniciar o programa, **todos os produtos sumiam**;
- nada garantia que o **banco de verdade** aceitaria o que o código mandava (tamanho do campo, campo obrigatório, tipo);
- nada garantia que a **estrutura do banco** (as tabelas) existisse em um banco novo.

Um teste com memória prova a **lógica**. Ele não prova a **persistência**. São duas perguntas diferentes.

## 2. Antes de ler a solução: o que muda quando sai da memória?
Em 15 minutos, sem consultar o código, liste **pelo menos cinco coisas** que podem dar errado ao trocar uma lista em memória por uma tabela de banco de dados relacional (um banco organizado em tabelas, linhas e colunas). Pense em:
- o que a lista aceita e a tabela pode recusar;
- o que precisa **existir antes** de gravar a primeira linha;
- como você **confere** que a linha foi para o banco, e não só que o código "disse" que gravou.

Guarde a lista. Você vai compará-la com a da seção 5.

## 3. A tentativa ingênua
| Atalho | Por que não basta |
|---|---|
| "Os testes com memória já passam" | a memória aceita qualquer texto, de qualquer tamanho; o banco, não |
| "Deixo o ORM criar as tabelas sozinho" | o ORM (*Object-Relational Mapping*, a biblioteca que traduz objetos do código em linhas do banco; aqui, o TypeORM) pode ter um modo de **sincronizar** a estrutura automaticamente. Em produção isso pode apagar ou alterar dados sem aviso, e a estrutura deixa de ter **histórico** |
| "Rodei na minha máquina e gravou" | o seu banco já tem tabelas de testes anteriores; em um banco novo (o de outra pessoa, o do CI) pode falhar |
| "O método `save` devolveu o objeto" | devolver não é gravar; só consultar o banco **diretamente** confirma |

No CeliLac, a sincronização automática está **desligada** (`synchronize: false`) justamente por isso.

## 4. A solução: quatro peças e duas provas

### 4.1. As quatro peças
| Peça | Função | Onde está no CeliLac |
|---|---|---|
| **Migration** (*migração*) | Um arquivo **versionado** que descreve uma mudança na estrutura do banco: `up` aplica, `down` desfaz | `src/database/migrations/1794255600000-CreateProductsTable.ts` |
| **Entidade do ORM** | Descreve, no código, como a tabela é (colunas, tipos, tamanho) | `src/infrastructure/persistence/products/product.orm-entity.ts` |
| **Mapper** (*mapeador*) | Converte o objeto do **domínio** (`Product`) no objeto do **banco** e vice-versa | `product.mapper.ts` |
| **Adaptador do repositório** | Implementa a **interface** `ProductsRepository` falando com o banco real | `typeorm-products.repository.ts` |

A interface do repositório tem **um único método**:
```ts
export interface ProductsRepository {
  save(product: Product): Promise<Product>;
}
```
O serviço de produtos (módulo 5) conhece **só essa interface**. Por isso foi possível trocar a memória pelo banco **sem tocar nas regras de negócio**: o módulo `products.module.ts` apenas passou a fornecer o `TypeOrmProductsRepository` no lugar do repositório em memória. A isso se chama **porta e adaptador** (*port/adapter*): a interface é a porta; cada implementação (memória, banco) é um adaptador.

### 4.2. A migration, por dentro
A migration do CeliLac cria o esquema (*schema*, um "espaço" que agrupa tabelas dentro do banco) e a tabela:
```sql
CREATE SCHEMA IF NOT EXISTS products;
CREATE TABLE "products"."products" (
  "productId" uuid NOT NULL,
  "name" character varying(120) NOT NULL,
  CONSTRAINT "PK_products_productId" PRIMARY KEY ("productId")
);
```
Em palavras: o produto tem um identificador (`uuid`, um código único universal) que é a **chave primária** (PK, *Primary Key*: a coluna que identifica cada linha sem repetição), e um nome de **no máximo 120 caracteres** e **obrigatório** (`NOT NULL`: a coluna não aceita ficar sem valor).

O `down` faz o oposto (apaga a tabela e o esquema). Ele existe para o desenvolvedor, **não** para ser executado em qualquer banco: desfazer uma migration em um banco com dados reais perde esses dados.

### 4.3. Prova 1: gravou mesmo? (teste com banco real)
O teste `typeorm-products.repository.postgres.spec.ts` sobe contra o **banco de testes** (módulo 4), aplica as migrations e faz duas coisas:
1. Salva um produto pelo repositório.
2. **Lê a linha direto por SQL** (*Structured Query Language*, a linguagem de consulta dos bancos), sem passar pelo repositório:
```ts
const rows = await dataSource.query(
  'SELECT "productId", "name" FROM "products"."products" WHERE "productId" = $1',
  [product.productId],
);
expect(rows).toHaveLength(1);
```
> **Por que ler por SQL?** Se o teste lesse pelo mesmo repositório, um erro de mapeamento aparece **nos dois lados** e se anula. A leitura direta é uma **segunda testemunha**.

### 4.4. Prova 2: do zero, a estrutura nasce certa? (banco vazio)
Um teste que roda no seu banco "sujo" não prova que a estrutura nasce corretamente em um banco novo. A prova é rodar as migrations em um banco **vazio**.

O CeliLac faz isso **sem apagar nada**, de um jeito elegante: no CI, o job do Docker Compose (apoio C e D) sobe um banco novo a cada execução, porque o volume é criado do zero. O log desse job mostra:
```
3 migrations are new migrations must be executed.
Migration EnableUuidOssp1792519198707 has been executed successfully.
Migration CreateOrders1792519198708 has been executed successfully.
Migration CreateProductsTable1794255600000 has been executed successfully.
```
Isso está guardado em `docs/uc/uc12/evidencias/C/c2-migration-banco-vazio.txt`, com o número da execução e o commit. A frase "3 migrations are new" é a prova de que o banco **começou vazio**.

> **Lição:** a prova de "banco vazio" vem de um ambiente que **nasce vazio** (o CI), e não de você apagar o seu banco para testar. Apagar tem risco; o CI não tem.

## 5. Compare com a sua lista da seção 2
Os pontos que o caso real mostrou:
| O que pode dar errado | Como o caso real trata |
|---|---|
| O banco recusa o que a memória aceitava (tamanho, `NOT NULL`, caracteres) | teste com o banco real (a falha FE01 do módulo 6 só foi possível porque o banco é real) |
| A estrutura não existe em banco novo | migration + prova no CI com banco vazio |
| O ORM e a migration descrevem tabelas diferentes | **não há teste que compare** os dois; veja a seção 7 |
| O repositório "diz" que gravou | leitura direta por SQL |
| Um teste apaga dados que não devia | três travas no banco de testes (seção 6) |

## 6. Segurança: o teste apaga dados
Para começar cada teste limpo, o teste executa `TRUNCATE TABLE "products"."products"` (esvazia a tabela). Se isso rodasse no banco errado, **perderia dados reais**. Por isso o teste só executa se **três travas** passarem:
1. a variável `TEST_DB_ALLOW_DESTRUCTIVE=true` está definida;
2. o nome do banco confirmado **pela própria conexão** é `celilac_test`;
3. o usuário e a porta são os do banco de testes (`celilac_test`, porta 5435 do lado de fora).

Se qualquer uma falhar, o teste **lança erro e para**, antes de apagar qualquer coisa.

Existe também uma lista de comandos que **nunca** se roda em banco que não seja o de testes: `docker compose down -v` (apaga os volumes, ou seja, os dados), `DROP`, `TRUNCATE` e `migration:revert` (desfaz migrations). O método trata esses comandos como **proibidos fora do banco de testes**.

> **Lição:** teste destrutivo precisa **provar onde está** antes de destruir.

## 7. Uma dívida que o caso real deixou
O limite de 120 caracteres aparece em **três lugares**:
1. a constante `MAX_PRODUCT_NAME_LENGTH = 120` (regra do núcleo);
2. a entidade do ORM (`length: 120`);
3. a migration (`character varying(120)`).

Se alguém mudar um e esquecer os outros, **nada falha de imediato**: o núcleo pode aceitar 150 e o banco recusar. Isso apareceu como achado na auditoria do piloto e **não foi corrigido**. Uma solução possível (que **não** está implementada) seria um teste que lê o tamanho real da coluna no banco e o compara com a constante.

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

## 9. Como saber que funcionou
- [ ] O produto gravado aparece em uma consulta SQL **independente** do repositório.
- [ ] As migrations rodam em um banco **vazio** sem erro, com evidência (log do CI).
- [ ] O serviço **não foi alterado** para trocar o adaptador.
- [ ] Os testes destrutivos têm travas, e você **viu** pelo menos uma falhar de propósito (por exemplo, apontando para o banco errado).
- [ ] A mutação do passo 8 foi morta, com a saída guardada.

## 10. Armadilhas comuns
- **Ligar a sincronização automática** "só para ver funcionar" e esquecer ligada.
- **Testar só contra a memória** e declarar a persistência pronta.
- **Ler pelo mesmo repositório** que gravou (as duas pontas erram juntas).
- **Editar uma migration já aplicada.** Migration que já foi usada por outra pessoa ou ambiente **não se edita**: cria-se uma nova.
- **Rodar `down` ou `TRUNCATE` sem checar o banco.**
- **Esquecer o limite em um dos três lugares** (seção 7).

## 11. Exercícios
1. Por que o teste lê por SQL em vez de usar o próprio repositório?
2. O que a frase "3 migrations are new" prova que "passou na minha máquina" não prova?
3. Por que o `down` da migration não deve ser executado em qualquer banco?
4. Proponha um teste que detecte a divergência entre a constante de 120 e a coluna do banco.
5. No seu domínio, qual campo o banco pode recusar e a memória aceitaria?

## 12. Como lidar com a IA (inteligência artificial) neste módulo
- A IA costuma sugerir **ligar a sincronização automática** do ORM por ser mais curto. Recuse e peça uma migration.
- Peça que ela **explique cada coluna** da migration e compare você mesmo com o que o domínio exige.
- Se ela disser que "o teste prova que gravou", pergunte **por onde o teste leu** a linha. Se foi pelo mesmo repositório, não prova.
- **Nunca** deixe a IA rodar comandos destrutivos (`DROP`, `TRUNCATE`, `down -v`) sem você ter conferido **qual banco** está na conexão.
- Peça a evidência: o **log** das migrations em banco vazio, e não a frase "funcionou".

Próximo: módulo 9, alguém olhou o contrato real da API?
