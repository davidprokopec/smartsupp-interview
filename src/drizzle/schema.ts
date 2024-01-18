import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const agent = pgTable('agent', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const task = pgTable('task', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  agentId: integer('agent_id')
    .notNull()
    .references(() => agent.id),
  expectedTimeDone: timestamp('expected_time_done').notNull(),
  overdue: boolean('overdue').notNull().default(false),
  doneAt: timestamp('done_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const schema = {
  agent,
  task,
};
