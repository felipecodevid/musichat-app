import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../schema/sqlite';

const sqlite = SQLite.openDatabaseSync('musichat.db');
sqlite.execSync('PRAGMA journal_mode = WAL;');

export const db = drizzle(sqlite, { schema });
export { schema }; // opcional
