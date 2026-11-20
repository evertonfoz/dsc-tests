# Contrato — POST /products (UC12)

> Fatos vêm de `docs/uc/uc12/evidencias/D/contrato-final.txt` (executado após o C1b; o estado anterior está em `docs/uc/uc12/evidencias/D/contrato-atual.txt`). A coluna "Alvo" é o contrato decidido em `docs/adr/ADR-004-contrato-de-erros-e-validacao-de-nome-uc12.md` e `docs/adr/ADR-003-mapeamento-http-dos-erros-de-produtos.md`. O que ainda não está implementado é marcado **(a implementar)**.

## Requisição
`POST /products`, `Content-Type: application/json`, corpo `{ "name": string }`. Campos desconhecidos são ignorados.

## Respostas
| Situação | Hoje | Alvo | Situação |
|---|---|---|---|
| Nome válido (1 a 120 caracteres, com algum caractere que não seja espaço) | 201 `{ productId, name }` | igual | Implementado |
| Nome vazio | 400 (formato do ValidationPipe) | igual | Implementado |
| Nome ausente, `null` ou não texto | 400 (formato do ValidationPipe) | igual | Implementado |
| Nome só com espaços | 400 (formato do ValidationPipe) | igual | Implementado (F05 no núcleo, C1b no DTO) |
| Nome com mais de 120 caracteres | 400 (formato do ValidationPipe) | igual | Implementado (F06 no núcleo, C1b no DTO) |
| `InvalidProductNameException` chega ao HTTP sem o DTO a barrar | 400 no formato do ValidationPipe | igual | Implementado (C1b, filtro) |
| Falha de persistência (FE01) | 500 `{ statusCode, message, error: "ProductPersistenceFailedException" }` sem detalhes internos | igual | Implementado (ADR-003) |
| JSON inválido | 400 (mensagem do parser) | igual | Implementado |
| Método ou rota inexistente | 404 padrão do Nest | igual | Implementado |

## Observações do inventário final
- Nome ausente, `null` ou não texto: a lista `message` traz também a mensagem de `MaxLength`, além de `should not be empty` e `must be a string`. O status é 400 e o formato é o decidido; a mensagem extra é ruído conhecido, sem regra nova.
- Nome com caractere NUL ainda termina em 500 (FE01 documentado, sem regra nova).
- Campos extras (por exemplo `price`) são ignorados (ADR-004 do projeto).

## Formato dos erros 400
```json
{ "message": ["name should not be empty"], "error": "Bad Request", "statusCode": 400 }
```

## Nunca aparece na resposta
Mensagem do erro original do banco, host, nome de relação, pilha e quaisquer campos internos da entidade. Verificado para 500 em C1 e C2.

## Itens fora do contrato
Preço (ADR-002) e autenticação/autorização (o UC pede ator autorizado, sem detalhar).
