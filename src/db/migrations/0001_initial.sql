-- ─── Bexaltec — Initial Database Schema ─────────────────────────────────────
-- Run this in Neon SQL Editor to create all tables.
-- Or use: npm run db:push (drizzle-kit push)

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role     AS ENUM ('client', 'admin', 'technician');
  CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');
  CREATE TYPE priority      AS ENUM ('low', 'medium', 'high', 'critical');
  CREATE TYPE repair_status AS ENUM ('intake', 'diagnosis', 'waiting_parts', 'in_repair', 'testing', 'ready', 'delivered', 'cancelled');
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
  CREATE TYPE contract_type  AS ENUM ('basic', 'business', 'enterprise');
  CREATE TYPE wo_status      AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
  CREATE TYPE equip_status   AS ENUM ('active', 'warranty', 'repair', 'retired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Companies (before users, because users reference companies)
CREATE TABLE IF NOT EXISTS companies (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  nif           VARCHAR(20)  UNIQUE,
  sector        VARCHAR(100),
  address       TEXT,
  city          VARCHAR(80),
  phone         VARCHAR(30),
  email         VARCHAR(160),
  website       VARCHAR(200),
  contract_type contract_type,
  revenue       NUMERIC(12,2),
  notes         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  role          user_role    NOT NULL DEFAULT 'client',
  company_id    INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  phone         VARCHAR(30),
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id          SERIAL PRIMARY KEY,
  ref         VARCHAR(20) NOT NULL UNIQUE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      ticket_status NOT NULL DEFAULT 'open',
  priority    priority      NOT NULL DEFAULT 'medium',
  category    VARCHAR(80),
  client_id   INTEGER NOT NULL REFERENCES users(id),
  company_id  INTEGER REFERENCES companies(id),
  assigned_to INTEGER REFERENCES users(id),
  resolved_at TIMESTAMP,
  closed_at   TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id          SERIAL PRIMARY KEY,
  ticket_id   INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id   INTEGER NOT NULL REFERENCES users(id),
  body        TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Repair Jobs (Laboratory)
CREATE TABLE IF NOT EXISTS repair_jobs (
  id            SERIAL PRIMARY KEY,
  ref           VARCHAR(20) NOT NULL UNIQUE,
  device_name   VARCHAR(120) NOT NULL,
  brand         VARCHAR(60),
  model         VARCHAR(80),
  serial        VARCHAR(80),
  issue         TEXT NOT NULL,
  diagnosis     TEXT,
  resolution    TEXT,
  status        repair_status NOT NULL DEFAULT 'intake',
  priority      priority      NOT NULL DEFAULT 'medium',
  client_id     INTEGER NOT NULL REFERENCES users(id),
  company_id    INTEGER REFERENCES companies(id),
  technician_id INTEGER REFERENCES users(id),
  labor_cost    NUMERIC(10,2),
  parts_cost    NUMERIC(10,2),
  total_cost    NUMERIC(10,2),
  entry_date    TIMESTAMP NOT NULL DEFAULT NOW(),
  eta           TIMESTAMP,
  delivered_at  TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Equipment
CREATE TABLE IF NOT EXISTS equipment (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  serial         VARCHAR(80),
  category       VARCHAR(60),
  brand          VARCHAR(60),
  model          VARCHAR(80),
  location       VARCHAR(120),
  client_id      INTEGER REFERENCES users(id),
  company_id     INTEGER REFERENCES companies(id),
  status         equip_status NOT NULL DEFAULT 'active',
  warranty_until TIMESTAMP,
  purchased_at   TIMESTAMP,
  notes          TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Spare Parts / Stock
CREATE TABLE IF NOT EXISTS parts (
  id          SERIAL PRIMARY KEY,
  ref         VARCHAR(40) NOT NULL UNIQUE,
  name        VARCHAR(120) NOT NULL,
  category    VARCHAR(60),
  brand       VARCHAR(60),
  stock_qty   INTEGER NOT NULL DEFAULT 0,
  min_qty     INTEGER NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2),
  supplier    VARCHAR(120),
  location    VARCHAR(80),
  notes       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Work Orders
CREATE TABLE IF NOT EXISTS work_orders (
  id            SERIAL PRIMARY KEY,
  ref           VARCHAR(20) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  status        wo_status NOT NULL DEFAULT 'pending',
  priority      priority  NOT NULL DEFAULT 'medium',
  client_id     INTEGER REFERENCES users(id),
  company_id    INTEGER REFERENCES companies(id),
  technician_id INTEGER REFERENCES users(id),
  value         NUMERIC(10,2),
  scheduled_at  TIMESTAMP,
  completed_at  TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Contracts & SLA
CREATE TABLE IF NOT EXISTS contracts (
  id            SERIAL PRIMARY KEY,
  ref           VARCHAR(20) NOT NULL UNIQUE,
  company_id    INTEGER NOT NULL REFERENCES companies(id),
  type          contract_type NOT NULL DEFAULT 'basic',
  sla_target    INTEGER DEFAULT 95,
  response_time INTEGER DEFAULT 4,
  value         NUMERIC(12,2),
  start_date    TIMESTAMP NOT NULL,
  end_date      TIMESTAMP NOT NULL,
  auto_renew    BOOLEAN NOT NULL DEFAULT false,
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id            SERIAL PRIMARY KEY,
  ref           VARCHAR(20) NOT NULL UNIQUE,
  company_id    INTEGER REFERENCES companies(id),
  client_id     INTEGER REFERENCES users(id),
  work_order_id INTEGER REFERENCES work_orders(id),
  repair_job_id INTEGER REFERENCES repair_jobs(id),
  status        invoice_status NOT NULL DEFAULT 'draft',
  amount        NUMERIC(12,2) NOT NULL,
  tax           NUMERIC(10,2) DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL,
  currency      VARCHAR(5) NOT NULL DEFAULT 'AOA',
  issue_date    TIMESTAMP NOT NULL DEFAULT NOW(),
  due_date      TIMESTAMP NOT NULL,
  paid_at       TIMESTAMP,
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  type       VARCHAR(40) NOT NULL DEFAULT 'info',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  link       TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tickets_client   ON tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status   ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_repairs_client   ON repair_jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_repairs_status   ON repair_jobs(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client  ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status  ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_notifs_user      ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company    ON users(company_id);

-- ── Seed: default admin account ───────────────────────────────────────────────
-- Password: Admin@Bexaltec2024 (bcrypt hash — change after first login!)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Administrador Bexaltec',
  'admin@bexaltec.ao',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TdUGQrjUNzZaA5UZNzMJv5bBN2oC',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
