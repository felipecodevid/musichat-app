import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  type: text('type').notNull().default('text'), // 'text' | 'audio'
  mediaUri: text('media_uri'),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: text('user_id').notNull(),
  songId: text('song_id')
    .notNull()
    .references(() => songs.id),
  deviceId: text('device_id')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  version: integer('version').notNull().default(0),
  deletedAt: integer('deleted_at'),
});

export const albums = sqliteTable('albums', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tags: text('tags'), // JSON array stored as string
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: text('user_id').notNull(),
  deviceId: text('device_id')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  version: integer('version').notNull().default(0),
  deletedAt: integer('deleted_at'),
});

export const songs = sqliteTable('songs', {
  id: text('id').primaryKey(),
  albumId: text('album_id')
    .notNull()
    .references(() => albums.id),
  name: text('name').notNull(),
  description: text('description'),
  tags: text('tags'), // JSON array stored as string
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: text('user_id').notNull(),
  deviceId: text('device_id')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  version: integer('version').notNull().default(0),
  deletedAt: integer('deleted_at'),
});

export const outbox = sqliteTable('_outbox', {
  opId: text('op_id').primaryKey(), // nanoid
  table: text('table').notNull(), // "todos"
  type: text('type').notNull(), // "insert" | "update" | "delete"
  payload: text('payload').notNull(), // JSON string con la fila
  createdAt: integer('created_at').notNull(),
});

export const meta = sqliteTable(
  '_meta',
  {
    userId: text('user_id').notNull(),
    key: text('key').notNull(),
    value: text('value'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.key] }),
  })
);
