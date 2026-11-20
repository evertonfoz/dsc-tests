# ADR-004 — Contrato de erros e validação de nome em POST /products (UC12)

- **Status:** Aceita
- **Data:** 2026-11-20
- **Decisores:** Professor responsável (respostas à consulta da Fase D)
- **Caso de uso / fase:** UC12, Fase D (contrato de resposta)

## Contexto
O inventário real do contrato (`docs/uc/uc12/evidencias/D/contrato-atual.txt`) mostrou quatro pontos que o `uc-12.md` não define: dois formatos de corpo para erros 400, nome só com espaços aceito, nome com 121 caracteres devolvendo 500 e campos desconhecidos ignorados em silêncio.

## Decisão
1. **Formato único para erros 400 de produtos:** o do `ValidationPipe` (`message` como lista, `error: "Bad Request"`, `statusCode: 400`). `InvalidProductNameException` passa a ser respondida nesse formato. As exceções de `orders` não mudam.
2. **Nome só com espaços é inválido (400).** O nome, sem espaços nas pontas, não pode ser vazio. Substitui a delimitação "só `''`" da revisão da F03.
3. **Nome acima de 120 caracteres é inválido (400)**, coerente com a coluna `varchar(120)`; deixa de ser 500.
4. **Campos desconhecidos continuam ignorados** (`whitelist`), documentado no contrato. Reavaliar quando o preço existir (ADR-002).

## Consequências
- (+) O cliente trata um único formato de erro 400 em produtos.
- (+) Remove o 500 evitável do nome longo e o produto sem nome visível.
- (−) Duas fatias novas (F05, F06) voltam ao ciclo B, depois de a Fase C ter fechado.
- (−) O teste do C1 que fixa o corpo do 400 do nome vazio muda de formato.
- (−) Ignorar campos extras pode enganar quem envia `price`; ver ADR-002.

## Alternativas consideradas
- **Manter dois formatos** — descartada: exige que o cliente trate dois formatos para o mesmo status.
- **Rejeitar campos extras** — descartada por ora: o preço ainda não existe e a compatibilidade com clientes tem mais valor hoje.
