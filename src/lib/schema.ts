// ─── Drizzle ORM Schema — Bexaltec CRM/Portal ────────────────────────────────
// Full database schema: users, companies, tickets, repairs, equipment,
// parts, work orders, invoices, contracts, notifications.

import {
  pgTable, serial, text, varchar, integer, numeric,
  timestamp, boolean, pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Enums ──────────────────────────────────────────────────────────────────
export const userRoleEnum     = pgEnum('user_role',     ['client', 'admin', 'technician'])
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'in_progress', 'waiting', 'resolved', 'closed'])
export const priorityEnum     = pgEnum('priority',      ['low', 'medium', 'high', 'critical'])
export const repairStatusEnum = pgEnum('repair_status', ['intake', 'diagnosis', 'waiting_parts', 'in_repair', 'testing', 'ready', 'delivered', 'cancelled'])
export const invoiceStatusEnum= pgEnum('invoice_status',['draft', 'sent', 'paid', 'overdue', 'cancelled'])
export const contractTypeEnum = pgEnum('contract_type', ['basic', 'business', 'enterprise'])
export const woStatusEnum     = pgEnum('wo_status',     ['pending', 'in_progress', 'completed', 'cancelled'])
export const equipStatusEnum  = pgEnum('equip_status',  ['active', 'warranty', 'repair', 'retired'])

// ── Users ─────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:           serial('id').primaryKey(),
  name:         varchar('name', { length: 120 }).notNull(),
  email:        varchar('email', { length: 160 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         userRoleEnum('role').default('client').notNull(),
  companyId:    integer('company_id').references(() => companies.id, { onDelete: 'set null' }),
  phone:        varchar('phone', { length: 30 }),
  avatarUrl:    text('avatar_url'),
  isActive:     boolean('is_active').default(true).notNull(),
  lastLoginAt:  timestamp('last_login_at'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// ── Companies ─────────────────────────────────────────────────────────────
export const companies = pgTable('companies', {
  id:           serial('id').primaryKey(),
  name:         varchar('name', { length: 200 }).notNull(),
  nif:          varchar('nif', { length: 20 }).unique(),
  sector:       varchar('sector', { length: 100 }),
  address:      text('address'),
  city:         varchar('city', { length: 80 }),
  phone:        varchar('phone', { length: 30 }),
  email:        varchar('email', { length: 160 }),
  website:      varchar('website', { length: 200 }),
  contractType: contractTypeEnum('contract_type'),
  revenue:      numeric('revenue', { precision: 12, scale: 2 }),
  notes:        text('notes'),
  isActive:     boolean('is_active').default(true).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// ── Tickets ───────────────────────────────────────────────────────────────
export const tickets = pgTable('tickets', {
  id:           serial('id').primaryKey(),
  ref:          varchar('ref', { length: 20 }).notNull().unique(),
  title:        varchar('title', { length: 255 }).notNull(),
  description:  text('description'),
  status:       ticketStatusEnum('status').default('open').notNull(),
  priority:     priorityEnum('priority').default('medium').notNull(),
  category:     varchar('category', { length: 80 }),
  clientId:     integer('client_id').references(() => users.id).notNull(),
  companyId:    integer('company_id').references(() => companies.id),
  assignedTo:   integer('assigned_to').references(() => users.id),
  resolvedAt:   timestamp('resolved_at'),
  closedAt:     timestamp('closed_at'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

export const ticketMessages = pgTable('ticket_messages', {
  id:        serial('id').primaryKey(),
  ticketId:  integer('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  authorId:  integer('author_id').references(() => users.id).notNull(),
  body:      text('body').notNull(),
  isInternal:boolean('is_internal').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Repair Jobs ───────────────────────────────────────────────────────────
export const repairJobs = pgTable('repair_jobs', {
  id:           serial('id').primaryKey(),
  ref:          varchar('ref', { length: 20 }).notNull().unique(),
  deviceName:   varchar('device_name', { length: 120 }).notNull(),
  brand:        varchar('brand', { length: 60 }),
  model:        varchar('model', { length: 80 }),
  serial:       varchar('serial', { length: 80 }),
  issue:        text('issue').notNull(),
  diagnosis:    text('diagnosis'),
  resolution:   text('resolution'),
  status:       repairStatusEnum('status').default('intake').notNull(),
  priority:     priorityEnum('priority').default('medium').notNull(),
  clientId:     integer('client_id').references(() => users.id).notNull(),
  companyId:    integer('company_id').references(() => companies.id),
  technicianId: integer('technician_id').references(() => users.id),
  laborCost:    numeric('labor_cost', { precision: 10, scale: 2 }),
  partsCost:    numeric('parts_cost', { precision: 10, scale: 2 }),
  totalCost:    numeric('total_cost', { precision: 10, scale: 2 }),
  entryDate:    timestamp('entry_date').defaultNow().notNull(),
  eta:          timestamp('eta'),
  deliveredAt:  timestamp('delivered_at'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// ── Equipment (client assets) ─────────────────────────────────────────────
export const equipment = pgTable('equipment', {
  id:            serial('id').primaryKey(),
  name:          varchar('name', { length: 120 }).notNull(),
  serial:        varchar('serial', { length: 80 }),
  category:      varchar('category', { length: 60 }),
  brand:         varchar('brand', { length: 60 }),
  model:         varchar('model', { length: 80 }),
  location:      varchar('location', { length: 120 }),
  clientId:      integer('client_id').references(() => users.id),
  companyId:     integer('company_id').references(() => companies.id),
  status:        equipStatusEnum('status').default('active').notNull(),
  warrantyUntil: timestamp('warranty_until'),
  purchasedAt:   timestamp('purchased_at'),
  notes:         text('notes'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
})

// ── Spare Parts / Stock ───────────────────────────────────────────────────
export const parts = pgTable('parts', {
  id:         serial('id').primaryKey(),
  ref:        varchar('ref', { length: 40 }).notNull().unique(),
  name:       varchar('name', { length: 120 }).notNull(),
  category:   varchar('category', { length: 60 }),
  brand:      varchar('brand', { length: 60 }),
  stockQty:   integer('stock_qty').default(0).notNull(),
  minQty:     integer('min_qty').default(1).notNull(),
  unitPrice:  numeric('unit_price', { precision: 10, scale: 2 }),
  supplier:   varchar('supplier', { length: 120 }),
  location:   varchar('location', { length: 80 }),
  notes:      text('notes'),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
})

// ── Work Orders ───────────────────────────────────────────────────────────
export const workOrders = pgTable('work_orders', {
  id:           serial('id').primaryKey(),
  ref:          varchar('ref', { length: 20 }).notNull().unique(),
  title:        varchar('title', { length: 255 }).notNull(),
  description:  text('description'),
  status:       woStatusEnum('status').default('pending').notNull(),
  priority:     priorityEnum('priority').default('medium').notNull(),
  clientId:     integer('client_id').references(() => users.id),
  companyId:    integer('company_id').references(() => companies.id),
  technicianId: integer('technician_id').references(() => users.id),
  value:        numeric('value', { precision: 10, scale: 2 }),
  scheduledAt:  timestamp('scheduled_at'),
  completedAt:  timestamp('completed_at'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// ── Contracts & SLA ───────────────────────────────────────────────────────
export const contracts = pgTable('contracts', {
  id:           serial('id').primaryKey(),
  ref:          varchar('ref', { length: 20 }).notNull().unique(),
  companyId:    integer('company_id').references(() => companies.id).notNull(),
  type:         contractTypeEnum('type').default('basic').notNull(),
  slaTarget:    integer('sla_target').default(95),   // % uptime target
  responseTime: integer('response_time').default(4), // hours
  value:        numeric('value', { precision: 12, scale: 2 }),
  startDate:    timestamp('start_date').notNull(),
  endDate:      timestamp('end_date').notNull(),
  autoRenew:    boolean('auto_renew').default(false).notNull(),
  notes:        text('notes'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// ── Invoices ──────────────────────────────────────────────────────────────
export const invoices = pgTable('invoices', {
  id:          serial('id').primaryKey(),
  ref:         varchar('ref', { length: 20 }).notNull().unique(),
  companyId:   integer('company_id').references(() => companies.id),
  clientId:    integer('client_id').references(() => users.id),
  workOrderId: integer('work_order_id').references(() => workOrders.id),
  repairJobId: integer('repair_job_id').references(() => repairJobs.id),
  status:      invoiceStatusEnum('status').default('draft').notNull(),
  amount:      numeric('amount', { precision: 12, scale: 2 }).notNull(),
  tax:         numeric('tax', { precision: 10, scale: 2 }).default('0'),
  total:       numeric('total', { precision: 12, scale: 2 }).notNull(),
  currency:    varchar('currency', { length: 5 }).default('AOA').notNull(),
  issueDate:   timestamp('issue_date').defaultNow().notNull(),
  dueDate:     timestamp('due_date').notNull(),
  paidAt:      timestamp('paid_at'),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})

// ── Notifications ─────────────────────────────────────────────────────────
export const notifications = pgTable('notifications', {
  id:        serial('id').primaryKey(),
  userId:    integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title:     varchar('title', { length: 200 }).notNull(),
  body:      text('body'),
  type:      varchar('type', { length: 40 }).default('info').notNull(),
  isRead:    boolean('is_read').default(false).notNull(),
  link:      text('link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Relations ─────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  company:       one(companies, { fields: [users.companyId], references: [companies.id] }),
  tickets:       many(tickets, { relationName: 'clientTickets' }),
  assignedTickets: many(tickets, { relationName: 'assignedTickets' }),
  repairJobs:    many(repairJobs, { relationName: 'clientRepairs' }),
  notifications: many(notifications),
}))

export const companiesRelations = relations(companies, ({ many }) => ({
  users:      many(users),
  tickets:    many(tickets),
  repairs:    many(repairJobs),
  equipment:  many(equipment),
  workOrders: many(workOrders),
  contracts:  many(contracts),
  invoices:   many(invoices),
}))

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  client:   one(users,     { fields: [tickets.clientId],   references: [users.id], relationName: 'clientTickets' }),
  assigned: one(users,     { fields: [tickets.assignedTo], references: [users.id], relationName: 'assignedTickets' }),
  company:  one(companies, { fields: [tickets.companyId],  references: [companies.id] }),
  messages: many(ticketMessages),
}))

export const repairJobsRelations = relations(repairJobs, ({ one }) => ({
  client:     one(users,     { fields: [repairJobs.clientId],     references: [users.id], relationName: 'clientRepairs' }),
  technician: one(users,     { fields: [repairJobs.technicianId], references: [users.id] }),
  company:    one(companies, { fields: [repairJobs.companyId],    references: [companies.id] }),
}))

// ── Type exports ──────────────────────────────────────────────────────────
export type User        = typeof users.$inferSelect
export type NewUser     = typeof users.$inferInsert
export type Company     = typeof companies.$inferSelect
export type NewCompany  = typeof companies.$inferInsert
export type Ticket      = typeof tickets.$inferSelect
export type NewTicket   = typeof tickets.$inferInsert
export type RepairJob   = typeof repairJobs.$inferSelect
export type NewRepairJob= typeof repairJobs.$inferInsert
export type Equipment   = typeof equipment.$inferSelect
export type Part        = typeof parts.$inferSelect
export type WorkOrder   = typeof workOrders.$inferSelect
export type Contract    = typeof contracts.$inferSelect
export type Invoice     = typeof invoices.$inferSelect
export type Notification= typeof notifications.$inferSelect
