import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../src/db/client/pg';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, '../src/db/migrations/pg');

async function main() {
  await migrate(db, { migrationsFolder });
  console.log('PG migrations applied');
  await pool.end();
}
main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
