import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  pin: text('pin').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const folders = pgTable('folders', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'), // Reference to another folder.id
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  type: text('type').notNull(),
  folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
