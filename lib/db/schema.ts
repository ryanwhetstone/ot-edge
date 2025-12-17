import { pgTable, serial, varchar, timestamp, integer, date, index, uuid, text, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    emailIdx: index('idx_users_email').on(table.email),
  };
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  birthDate: date('birth_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('idx_clients_user_id').on(table.userId),
    uuidIdx: index('idx_clients_uuid').on(table.uuid),
  };
});

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    clientIdIdx: index('idx_evaluations_client_id').on(table.clientId),
    userIdIdx: index('idx_evaluations_user_id').on(table.userId),
    uuidIdx: index('idx_evaluations_uuid').on(table.uuid),
  };
});

export const spm2Assessments = pgTable('spm2_assessments', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  evaluationId: integer('evaluation_id').references(() => evaluations.id, { onDelete: 'set null' }),
  assessmentDate: timestamp('assessment_date').defaultNow(),
  responses: jsonb('responses').notNull(), // Store all question responses as JSON
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    clientIdIdx: index('idx_spm2_client_id').on(table.clientId),
    userIdIdx: index('idx_spm2_user_id').on(table.userId),
    evaluationIdIdx: index('idx_spm2_evaluation_id').on(table.evaluationId),
    uuidIdx: index('idx_spm2_uuid').on(table.uuid),
  };
});
