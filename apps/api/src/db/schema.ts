import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';

export const bears = pgTable('bears', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  binomial: text('binomial').notNull().unique(),
  imageUrl: text('image_url'),
  range: text('range'),
  fetchedAt: timestamp('fetched_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bearId: text('bear_id')
      .notNull()
      .references(() => bears.id, {
        onDelete: 'cascade',
      }),
    author: text('author').notNull(),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('comments_bear_created_idx').on(
      table.bearId,
      table.createdAt,
      table.id
    ),
  ]
);
