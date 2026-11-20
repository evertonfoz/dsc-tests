import { MigrationInterface, QueryRunner } from 'typeorm';

// A migration CreateOrders (1792519198708) usa uuid_generate_v4() como valor padrão, mas nenhuma
// migration criava a extensão que fornece essa função: ela só existia em bancos onde alguém a
// instalou manualmente. Esta migration a cria ANTES (timestamp 1 ms menor), de forma idempotente.
// Em bancos que já têm a extensão, é um no-op.
export class EnableUuidOssp1792519198707 implements MigrationInterface {
  name = 'EnableUuidOssp1792519198707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down(): Promise<void> {
    // Intencionalmente vazio: a extensão pode ser usada por outros objetos do banco.
  }
}
