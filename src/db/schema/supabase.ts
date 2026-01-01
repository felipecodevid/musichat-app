import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, text, integer, pgPolicy } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  type: text('type').notNull().default('text'), // 'text' | 'audio'
  mediaUri: text('media_uri'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: uuid('user_id').notNull(),
  songId: uuid('song_id').notNull().references(() => songs.id),
  deviceId: uuid('device_id').notNull(),
  version: integer('version').notNull().default(0),
  deletedAt: timestamp('deleted_at'),
}, () => OWN_POLICIES);

export const albums = pgTable('albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  tags: text('tags').array(),
  userId: uuid('user_id').notNull(),
  deviceId: uuid('device_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  version: integer('version').notNull().default(0),
  deletedAt: timestamp('deleted_at'),
}, () => OWN_POLICIES);

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  albumId: uuid('album_id').notNull().references(() => albums.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  tags: text('tags').array(),
  userId: uuid('user_id').notNull(),
  deviceId: uuid('device_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  version: integer('version').notNull().default(0),
  deletedAt: timestamp('deleted_at'),
}, () => OWN_POLICIES);


const OWN_POLICIES = [pgPolicy("select own", { as: "permissive", for: "select", to: "authenticated", using: sql`auth.uid() = user_id` }),
pgPolicy("insert own", { as: "permissive", for: "insert", to: "authenticated", withCheck: sql`auth.uid() = user_id` }),
pgPolicy("update own", { as: "permissive", for: "update", to: "authenticated", using: sql`auth.uid() = user_id` }),
pgPolicy("delete own", { as: "permissive", for: "delete", to: "authenticated", using: sql`auth.uid() = user_id` }),]