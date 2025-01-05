import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  deleted: boolean('deleted').default(false),
});
