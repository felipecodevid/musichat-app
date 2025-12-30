import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema/pg';

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  // ssl: { rejectUnauthorized: false } // si tu proveedor lo requiere
});

export const db = drizzle(pool, { schema });
export { schema, pool };
