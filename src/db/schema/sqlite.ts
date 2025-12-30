import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  deviceId: text('device_id').notNull(),
  version: integer('version').notNull().default(0),
  deletedAt: integer('deleted_at'),
});

export const outbox = sqliteTable("_outbox", {
  opId: text("op_id").primaryKey(),      // nanoid
  table: text("table").notNull(),        // "todos"
  type: text("type").notNull(),          // "insert" | "update" | "delete"
  payload: text("payload").notNull(),    // JSON string con la fila
  createdAt: integer("created_at").notNull(),
});

export const meta = sqliteTable("_meta", {
  key: text("key").primaryKey(),
  value: text("value"),
});