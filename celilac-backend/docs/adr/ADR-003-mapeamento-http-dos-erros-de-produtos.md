# ADR-003 — Mapeamento HTTP dos erros do núcleo de produtos (UC12)

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável (escolhas registradas na abertura da Fase C)
- **Caso de uso / fase:** UC12, Fase C1 (fronteira HTTP)

## Contexto
A Fase B criou `InvalidProductNameException` (F03) e `ProductPersistenceFailedException` (F04). O `uc-12.md` não define os status HTTP: FE01 é "proposta técnica" e os critérios falam apenas em "rejeitar" e "informar que a operação não foi concluída". Sem mapeamento, o `DomainHttpExceptionFilter` repassa ambos ao tratamento padrão do Nest, que responde 500 genérico.

## Decisão
| Exceção | Status | Corpo |
|---|---|---|
| `InvalidProductNameException` | 400 Bad Request | `{ statusCode, message, error }`, igual ao formato das demais exceções de domínio |
| `ProductPersistenceFailedException` | 500 Internal Server Error | mesmo formato; a `message` é a genérica da exceção, **nunca** a do erro original |

A causa original fica apenas em `cause` e no log do servidor, fora da resposta.

## Consequências
- (+) Formato único de erro de domínio e contrato testável.
- (+) Nenhum detalhe interno (SQL, host, relação) chega ao cliente.
- (−) 500 não distingue falha transitória de permanente; se o UC definir retentativa, a decisão deve ser revista (503).
- (−) 400 para nome vazio coincide com o do DTO; os dois caminhos devolvem formatos de corpo diferentes (o DTO usa o formato do `ValidationPipe`). A unificação é assunto da Fase D.

## Alternativas consideradas
- **503 para falha de persistência** — descartada: assume falha transitória, que o UC não afirma.
- **422 para nome vazio** — descartada: diverge do 400 que o contrato atual já documenta e testa.
