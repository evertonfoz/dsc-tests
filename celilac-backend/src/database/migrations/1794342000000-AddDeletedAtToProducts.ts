import { type MigrationInterface, type QueryRunner } from 'typeorm';

// ADR-005: soft delete. A coluna é anulável e sem valor padrão: os produtos
// existentes permanecem ativos (deletedAt nulo).
export class AddDeletedAtToProducts1794342000000 implements MigrationInterface {
  name = 'AddDeletedAtToProducts1794342000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products"."products" ADD COLUMN "deletedAt" TIMESTAMP WITH TIME ZONE NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products"."products" DROP COLUMN "deletedAt"`,
    );
  }
}
