import { reset } from 'drizzle-seed'
import { supabase } from '../src/db/client/supabase'
import * as schema from '../src/db/schema/supabase'
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema });
export { schema }; // opcional


export async function clearDatabase() {
  console.log('🗑️ Clearing database...')
  await reset(db, schema)
}

if (require.main == module)
  (async () => {
    await clearDatabase()
    await client.end()
  })()