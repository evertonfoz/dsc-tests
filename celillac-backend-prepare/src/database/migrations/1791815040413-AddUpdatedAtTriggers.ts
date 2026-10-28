import { MigrationInterface, QueryRunner } from "typeorm";

// Garante que updatedAt seja atualizado pelo banco em qualquer UPDATE,
// inclusive os feitos fora do TypeORM.
export class AddUpdatedAtTriggers1791815040413 implements MigrationInterface {
    name = 'AddUpdatedAtTriggers1791815040413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS trigger AS $$
            BEGIN
                NEW."updatedAt" = now();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);
        await queryRunner.query(`CREATE TRIGGER "orders_set_updated_at" BEFORE UPDATE ON "orders"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"()`);
        await queryRunner.query(`CREATE TRIGGER "payments_set_updated_at" BEFORE UPDATE ON "payments"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER "payments_set_updated_at" ON "payments"."payments"`);
        await queryRunner.query(`DROP TRIGGER "orders_set_updated_at" ON "orders"."orders"`);
        await queryRunner.query(`DROP FUNCTION "public"."set_updated_at"()`);
    }

}
