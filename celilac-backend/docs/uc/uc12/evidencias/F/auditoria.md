# Auditoria arquitetural do UC12 (Fase F, 2026-11-20)

Método: leitura dos imports e do código dos arquivos do UC (comandos de `grep` sobre `src/modules/products`, `src/infrastructure/persistence/products` e `src/common`). Etiquetas: *Confirmado no código* ou *Hipótese*. Nenhuma refatoração foi feita nesta fase.

## Conformidade
| Verificação | Resultado | Etiqueta |
|---|---|---|
| Serviço não importa TypeORM, Express nem infraestrutura; só exceções de `common` e a porta `ProductsRepository` | conforme | Confirmado no código |
| A infraestrutura depende do núcleo (mapper e repositório importam `Product` e a porta), nunca o contrário | conforme | Confirmado no código |
| Regra de negócio do nome no serviço; o DTO só repete a barreira na fronteira | conforme | Confirmado no código |
| Controller sem regra: só delega ao serviço | conforme | Confirmado no código |
| Respostas não vazam detalhes internos do banco | conforme (testes M e P) | Executado nesta fase |

## Achados
| # | Achado | Etiqueta | Proposta |
|---|---|---|---|
| A1 | O limite 120 existe em três lugares escritos à mão: `product-name.rules.ts`, a coluna do ORM (`length: 120`) e a migration (`varchar(120)`). Mudar um sem os outros dá 500 em vez de 400 | Confirmado no código | Sem ação agora; se o limite mudar, alterar os três. Nenhum teste de banco real grava exatamente 120 caracteres (o cenário de 120 do `run-checks.sh` cobre isso no Compose) |
| A2 | A configuração do `ValidationPipe` ficava em `main.ts`; testes e inventário a repetiam à mão | Confirmado no código | **Tratado** (recomendação aceita pelo professor): `createValidationPipe()` compartilhado, PR de refatoração |
| A3 | Nome com caractere NUL passa o DTO e o serviço e termina em 500 (o banco rejeita) | Confirmado no código (FE01 documentado) | **Decidido** (recomendação aceita): manter como FE01; o UC não define restrição de caracteres |
| A4 | Sem o DTO, o `InvalidProductNameException` responde com a mensagem em inglês do domínio, diferente do texto do DTO | Confirmado no código | Sem ação: hoje o DTO barra antes; hipótese sem problema real |
| A5 | O arquivo `products.integration.spec.ts` se chama "integração", mas usa repositório em memória; o teste com banco real é o `…postgres.spec.ts` | Confirmado no código | Sem ação neste UC; lembrar no material didático |
| A6 | Teste instável #27 no controller de products (400 com corpo válido, ~4%), sem causa | Confirmado (issue #27) | Continua aberta; **pode derrubar o CI por acaso** |
| A7 | Nenhum teste provava que, após uma requisição rejeitada, o banco real não ganhava linha (CA03/RN03) | Confirmado no código | **Tratado** (recomendação aceita pelo professor): teste E2E com banco real, validado por mutação |
