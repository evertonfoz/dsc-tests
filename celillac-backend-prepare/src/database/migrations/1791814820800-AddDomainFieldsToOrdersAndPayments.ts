import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDomainFieldsToOrdersAndPayments1791814820800 implements MigrationInterface {
    name = 'AddDomainFieldsToOrdersAndPayments1791814820800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Os DEFAULTs preenchem as linhas já existentes; a aplicação sempre envia os valores.
        await queryRunner.query(`ALTER TABLE "orders"."orders" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders"."orders" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders"."orders" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders"."orders" ALTER COLUMN "updatedAt" DROP DEFAULT`);

        await queryRunner.query(`ALTER TABLE "payments"."payments" ADD "amount" numeric(12,2) NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ADD "paidAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ALTER COLUMN "amount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" ALTER COLUMN "updatedAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments"."payments" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" DROP COLUMN "paidAt"`);
        await queryRunner.query(`ALTER TABLE "payments"."payments" DROP COLUMN "amount"`);

        await queryRunner.query(`ALTER TABLE "orders"."orders" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "orders"."orders" DROP COLUMN "createdAt"`);
    }

}
