// Salvaguardas e mapeamento do banco de TESTES para a suíte E2E.
// Regra do método (AGENTS.md, regra 16): testes que gravam dados nunca usam o banco de desenvolvimento.

export type Env = Record<string, string | undefined>;

export interface TestDbEnv {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

/**
 * Valida o ambiente e devolve a conexão do banco de testes.
 * Lança erro (com mensagem acionável) se qualquer salvaguarda falhar.
 */
export function assertSafeTestDbEnv(env: Env): TestDbEnv {
  const faltando = [
    'TEST_DB_HOST',
    'TEST_DB_PORT',
    'TEST_DB_USERNAME',
    'TEST_DB_PASSWORD',
    'TEST_DB_NAME',
  ].filter((k) => !env[k]);
  if (faltando.length > 0) {
    throw new Error(
      `E2E bloqueado: variáveis ausentes no .env: ${faltando.join(', ')}. Veja .env.example.`,
    );
  }

  if (env.TEST_DB_ALLOW_DESTRUCTIVE !== 'true') {
    throw new Error(
      'E2E bloqueado: defina TEST_DB_ALLOW_DESTRUCTIVE=true no .env para permitir migrations e escrita no banco de TESTES.',
    );
  }

  const database = env.TEST_DB_NAME!;
  if (!database.endsWith('_test')) {
    throw new Error(`E2E bloqueado: TEST_DB_NAME ("${database}") deve terminar em _test.`);
  }
  if (database === env.DB_NAME) {
    throw new Error('E2E bloqueado: TEST_DB_NAME é igual a DB_NAME (banco de desenvolvimento).');
  }
  if (env.TEST_DB_USERNAME === env.DB_USERNAME) {
    throw new Error('E2E bloqueado: TEST_DB_USERNAME é igual a DB_USERNAME (desenvolvimento).');
  }
  if (env.TEST_DB_PORT === env.DB_PORT) {
    throw new Error('E2E bloqueado: TEST_DB_PORT é igual a DB_PORT (desenvolvimento).');
  }

  return {
    host: env.TEST_DB_HOST!,
    port: env.TEST_DB_PORT!,
    username: env.TEST_DB_USERNAME!,
    password: env.TEST_DB_PASSWORD!,
    database,
  };
}

/** Variáveis DB_* que fazem o AppModule conectar ao banco de TESTES. */
export function mapTestDbToAppEnv(db: TestDbEnv): Record<string, string> {
  return {
    DB_HOST: db.host,
    DB_PORT: db.port,
    DB_USERNAME: db.username,
    DB_PASSWORD: db.password,
    DB_NAME: db.database,
  };
}
