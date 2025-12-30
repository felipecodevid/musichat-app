
import "dotenv/config";

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/supabase.ts',
  out: './src/db/migrations/supabase',
  dialect: 'postgresql',
  dbCredentials: {
    // Usa la URL de conexión de Supabase (role migrator/admin)
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
