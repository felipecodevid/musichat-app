import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, text, integer, pgPolicy } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: uuid('user_id').notNull(),
  deviceId: uuid('device_id').notNull(),
  version: integer('version').notNull().default(0),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  pgPolicy("select own", { as: "permissive", for: "select", to: "authenticated", using: sql`auth.uid() = user_id` }),
  pgPolicy("insert own", { as: "permissive", for: "insert", to: "authenticated", withCheck: sql`auth.uid() = user_id` }),
  pgPolicy("update own", { as: "permissive", for: "update", to: "authenticated", using: sql`auth.uid() = user_id` }),
  pgPolicy("delete own", { as: "permissive", for: "delete", to: "authenticated", using: sql`auth.uid() = user_id` }),
]);