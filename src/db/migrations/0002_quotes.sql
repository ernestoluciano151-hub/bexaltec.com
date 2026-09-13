-- ─── Bexaltec · Migração 0002 — Pedidos de Orçamento ───────────────────────
-- Cria a tabela que passa a receber os pedidos submetidos em /quote.
-- Aplicar com:  npm run db:push        (ou executar este ficheiro no Neon)

DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('new', 'in_review', 'sent', 'accepted', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS quotes (
  id             SERIAL PRIMARY KEY,
  ref            VARCHAR(24)  NOT NULL UNIQUE,
  client_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(160) NOT NULL,
  phone          VARCHAR(40),
  company        VARCHAR(160),
  province       VARCHAR(60),
  services       TEXT,
  budget         VARCHAR(60),
  deadline       VARCHAR(60),
  message        TEXT,
  status         quote_status NOT NULL DEFAULT 'new',
  value          NUMERIC(12,2),
  internal_notes TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_status  ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_client  ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_email   ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at DESC);
