import 'dotenv/config';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  assertSafeTestDbEnv,
  mapTestDbToAppEnv,
} from './test/support/test-db-env.ts';

// O E2E sobe o AppModule completo, que lê DB_*. Aqui DB_* é redirecionado para o banco de TESTES
// (TEST_DB_*), depois de validar as salvaguardas. Se alguma falhar, a execução é abortada.
const testDb = assertSafeTestDbEnv(process.env);

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: mapTestDbToAppEnv(testDb),
    globalSetup: ['./test/support/global-setup-e2e.ts'],
  },
});
