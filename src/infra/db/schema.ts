import { relations, SQL, sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  customType,
} from 'drizzle-orm/pg-core'

export const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
}))

export const recipes = pgTable(
  'recipes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    ingredients: text('ingredients').notNull(),
    method: text('method').notNull(),
    authorId: uuid('author_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    searchableText: tsvector('searchable_text').generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('portuguese', ${recipes.title}), 'A') ||
          setweight(to_tsvector('portuguese', ${recipes.ingredients}), 'B')`,
    ),
  },
  (table) => [index('searchable_text_idx').using('gin', table.searchableText)],
)

export const recipesRelations = relations(recipes, ({ one }) => ({
  author: one(users, {
    fields: [recipes.authorId],
    references: [users.id],
  }),
}))

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  expiresAt: timestamp('expires_at').notNull(),
})
