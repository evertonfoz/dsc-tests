# Conferência dos nomes de teste da tabela de cobertura (UC16)
# Método: cada nome citado em relatorios/A.md (seção 4), procurado literalmente nos arquivos de teste.

Nomes citados: 24

OK    should ignore any body sent with the request (CA10, FA04)  ->  products.remove.controller.spec.ts
OK    should keep a single record with the same productId and name and a deletedAt, without duplicating (CA06, RN01)  ->  products.service.remove.spec.ts
OK    should keep the other products active and unchanged (CA05, RN06)  ->  products.service.remove.spec.ts
OK    should keep the product active when the repository fails (CA11, RN05)  ->  products.service.remove.spec.ts
OK    should leave the removed product out of the active products of the repository (CA01, RN01)  ->  products.service.remove.spec.ts
OK    should leave the removed product out of the listing and decrease the total by one (CA03, RN03)  ->  products.service.remove.spec.ts
OK    should let exactly one of two simultaneous removals succeed and keep a single deletedAt (UC16, CA12, RN08)  ->  typeorm-products.repository.postgres.spec.ts
OK    should mark only the target row with deletedAt and keep productId, name and the other rows (UC16, CA05, CA06, RN01)  ->  typeorm-products.repository.postgres.spec.ts
OK    should not remove any other product when the identifier does not exist (CA07, RN05)  ->  products.service.remove.spec.ts
OK    should remove the active product and resolve without a body (CA01, RN09)  ->  products.service.remove.spec.ts
OK    should report an incomplete removal when the real database rejects it, without leaking details (UC16, CA11, FE01)  ->  typeorm-products.repository.postgres.spec.ts
OK    should report not found and change nothing when the productId does not exist (UC16, CA07)  ->  typeorm-products.repository.postgres.spec.ts
OK    should report not found and keep the original deletedAt when the product was already removed (UC16, CA08, RN07)  ->  typeorm-products.repository.postgres.spec.ts
OK    should return 204 without a body, keep the row with deletedAt and hide it from get, list and update (CA01 a CA04, CA06)  ->  remover-produto.e2e-spec.ts
OK    should return 400 in the ValidationPipe format for a non-UUID id, without calling the service (CA09, FA03)  ->  products.remove.controller.spec.ts
OK    should return 404 for an already removed product and keep its deletedAt (CA08, FA02)  ->  products.remove.controller.spec.ts
OK    should return 404 in the domain error format when the product does not exist (CA07, FA01)  ->  products.remove.controller.spec.ts
OK    should return 500 with a generic message and no cause details (CA11, FE01)  ->  products.remove.controller.spec.ts
OK    should throw ProductNotFoundException when getting the removed product (CA02, RN03)  ->  products.service.remove.spec.ts
OK    should throw ProductNotFoundException when removing the same product twice (CA08, RN07)  ->  products.service.remove.spec.ts
OK    should throw ProductNotFoundException when the product was already removed (CA08, FA02)  ->  products.service.remove.spec.ts
OK    should throw ProductNotFoundException when there is no product with the identifier (CA07, FA01)  ->  products.service.remove.spec.ts
OK    should throw ProductNotFoundException when updating the removed product (CA04, RN03)  ->  products.service.remove.spec.ts
OK    should throw ProductPersistenceFailedException without leaking the cause when the repository fails (CA11, FE01)  ->  products.service.remove.spec.ts

Ausentes: 0
