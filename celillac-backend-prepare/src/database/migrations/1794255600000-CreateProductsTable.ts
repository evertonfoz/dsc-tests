import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProductsTable1794255600000 implements MigrationInterface {
  name = 'CreateProductsTable1794255600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "productId" uuid NOT NULL,
        "name" character varying(120) NOT NULL,
        CONSTRAINT "PK_products_productId"
          PRIMARY KEY ("productId")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
