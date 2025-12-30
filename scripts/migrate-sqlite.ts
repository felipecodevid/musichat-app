import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '../src/db/client/sqlite';

// @ts-ignore - Vite/Metro pueden requerir importar así:
import * as migrations from '../src/db/migrations/sqlite';

async function main() {
  await migrate(db, migrations);
  console.log('SQLite migrations applied');
}
main();
