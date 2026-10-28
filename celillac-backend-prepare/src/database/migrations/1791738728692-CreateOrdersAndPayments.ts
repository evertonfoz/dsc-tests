import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersAndPayments1791738728692 implements MigrationInterface {
    name = 'CreateOrdersAndPayments1791738728692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS orders`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS payments`);

        await queryRunner.query(`CREATE TYPE "orders"."orders_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "orders"."orders" ("orderId" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "status" "orders"."orders_status_enum" NOT NULL, CONSTRAINT "PK_41ba27842ac1a2c24817ca59eaa" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`CREATE TYPE "payments"."payments_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "payments"."payments" ("paymentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" uuid NOT NULL, "status" "payments"."payments_status_enum" NOT NULL, CONSTRAINT "PK_ae0b0903f275c81d8a2a45ce3b5" PRIMARY KEY ("paymentId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payments"."payments"`);
        await queryRunner.query(`DROP TYPE "payments"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "orders"."orders"`);
        await queryRunner.query(`DROP TYPE "orders"."orders_status_enum"`);

        await queryRunner.query(`DROP SCHEMA IF EXISTS payments`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS orders`);
    }

}
