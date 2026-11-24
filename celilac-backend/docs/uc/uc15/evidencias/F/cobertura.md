# Conferência dos nomes de teste da tabela de cobertura (UC15)
# Método: cada nome citado em relatorios/A.md, seção 7, procurado literalmente nos 4 arquivos de teste.

Nomes citados: 27

OK    should change only the name of the active product in the real database and keep the other rows (UC15, CA01, CA03, CA04)  ->  typeorm-products.repository.postgres.spec.ts
OK    should change the name of the active product and return it (CA01)  ->  products.service.update.spec.ts
OK    should ignore productId and deletedAt in the body and keep the product active (CA04)  ->  alterar-produto.e2e-spec.ts
OK    should ignore productId and deletedAt sent in the body (CA04, FA05)  ->  products.update.controller.spec.ts
OK    should keep productId, deletedAt and the other products unchanged, without duplicating (CA04)  ->  products.service.update.spec.ts
OK    should keep the last name after two sequential updates (CA11)  ->  alterar-produto.e2e-spec.ts
OK    should keep the last name after two sequential updates in the real database (UC15, CA11)  ->  typeorm-products.repository.postgres.spec.ts
OK    should keep the name of the last of two sequential updates (CA11, RN08)  ->  products.service.update.spec.ts
OK    should not alter a removed product in the real database and report it as not found (UC15, CA06)  ->  typeorm-products.repository.postgres.spec.ts
OK    should reject a name that is %s without calling the repository (CA08)  ->  products.service.update.spec.ts
OK    should report an incomplete update when the real database rejects it, leaving the name unchanged (UC15, CA10)  ->  typeorm-products.repository.postgres.spec.ts
OK    should return 200 when the new name equals the current one (CA09)  ->  products.update.controller.spec.ts, alterar-produto.e2e-spec.ts
OK    should return 200 with exactly productId and the new name and persist it (CA01, CA02, CA03)  ->  alterar-produto.e2e-spec.ts
OK    should return 200 with only productId and the new name, and persist it (CA01, CA02, CA03)  ->  products.update.controller.spec.ts
OK    should return 400 for a name that is %s and keep the old name in the database (CA08)  ->  alterar-produto.e2e-spec.ts
OK    should return 400 in the ValidationPipe format for a name that is %s and keep the old name (CA08)  ->  products.update.controller.spec.ts
OK    should return 400 in the ValidationPipe format for a non-UUID id (CA07)  ->  alterar-produto.e2e-spec.ts
OK    should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA07)  ->  products.update.controller.spec.ts
OK    should return 404 for a UUID without a product (CA05)  ->  alterar-produto.e2e-spec.ts
OK    should return 404 for a removed product and leave it unchanged (CA06)  ->  products.update.controller.spec.ts
OK    should return 404 for a soft-deleted product and not alter it (CA06)  ->  alterar-produto.e2e-spec.ts
OK    should return 404 in the domain error format when the product does not exist (CA05)  ->  products.update.controller.spec.ts
OK    should return 500 with a generic message and no cause details (CA10)  ->  products.update.controller.spec.ts
OK    should succeed when the new name equals the current one (CA09)  ->  products.service.update.spec.ts
OK    should throw ProductNotFoundException and not change a removed product (CA06)  ->  products.service.update.spec.ts
OK    should throw ProductNotFoundException when the product does not exist (CA05)  ->  products.service.update.spec.ts
OK    should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA10)  ->  products.service.update.spec.ts

Resultado: 27 encontrados, 0 ausentes
