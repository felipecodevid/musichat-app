import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/sqlite.ts',
  out: './src/db/migrations/sqlite',
  dialect: 'sqlite',
  dbCredentials: { url: 'file:musichat.db' }, // solo generación
  verbose: true,
  strict: true,
  driver: 'expo',
});
