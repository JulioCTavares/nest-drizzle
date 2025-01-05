import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { products } from './products';

export const productCategories = pgTable(
  'product_categories',
  {
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.categoryId] }),
  }),
);
