import { boolean, decimal, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { products } from './products';

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isDeleted: boolean('is_deleted').default(false),
});
