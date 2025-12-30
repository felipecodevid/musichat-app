import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/pg.ts',
  out: './src/db/migrations/pg',
  dialect: 'postgresql',
  dbCredentials: {
    // Usa la URL de conexión de Supabase (role migrator/admin)
    url: process.env.SUPABASE_DB_URL as string,
  },
  verbose: true,
  strict: true,
});
