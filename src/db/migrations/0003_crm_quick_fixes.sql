-- ─── Bexaltec · Migração 0003 — Correcções rápidas do CRM ──────────────────
-- Ver AUDITORIA_CRM_2026-11.md, secção 3.3.
-- Idempotente: pode ser executada mais de uma vez.
-- Aplicar ANTES de publicar o código que a acompanha (executar no Neon).

-- 1. Numeração sequencial ──────────────────────────────────────────────────
-- Substitui Date.now().slice(-6), que colidia e reiniciava a cada ~16 min.
-- Uma linha por série e ano (ex.: 'BX-WO-2026'). O incremento é atómico
-- (INSERT … ON CONFLICT … RETURNING), sem corrida entre pedidos simultâneos.
CREATE TABLE IF NOT EXISTS ref_sequences (
  key        VARCHAR(40) PRIMARY KEY,
  value      INTEGER     NOT NULL DEFAULT 0,
  updated_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- 2. Limite de tentativas (login e pedidos de orçamento) ───────────────────
CREATE TABLE IF NOT EXISTS rate_events (
  id         SERIAL PRIMARY KEY,
  bucket     VARCHAR(40)  NOT NULL,
  key        VARCHAR(200) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_events_lookup ON rate_events(bucket, key, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_events_created ON rate_events(created_at);

-- 3. NIF vazio ─────────────────────────────────────────────────────────────
-- '' contava como valor na restrição UNIQUE: a segunda empresa sem NIF falhava.
UPDATE companies SET nif = NULL WHERE nif IS NOT NULL AND trim(nif) = '';

-- 4. Emails em minúsculas ──────────────────────────────────────────────────
-- O login procura lower(email). Um email gravado com maiúsculas pelo admin
-- deixava o utilizador sem acesso. Só normaliza quando não cria duplicado;
-- os casos que sobrarem aparecem na consulta de diagnóstico abaixo.
UPDATE users u
   SET email = lower(trim(u.email)), updated_at = NOW()
 WHERE u.email <> lower(trim(u.email))
   AND NOT EXISTS (
     SELECT 1 FROM users u2
      WHERE u2.email = lower(trim(u.email)) AND u2.id <> u.id
   );

-- 5. Índices nas chaves de cruzamento ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email_lower   ON users(lower(email));
CREATE INDEX IF NOT EXISTS idx_wo_company          ON work_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_wo_client           ON work_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_wo_technician       ON work_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company    ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_wo         ON invoices(work_order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_company     ON tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_repairs_company     ON repair_jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company   ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_company   ON equipment(company_id);

-- ─── Diagnóstico (só leitura — correr depois e rever à mão) ────────────────
-- Emails que diferem só em maiúsculas (não foram normalizados acima):
--   SELECT lower(trim(email)), array_agg(id) FROM users
--    GROUP BY 1 HAVING count(*) > 1;
-- Clientes sem empresa:
--   SELECT id, name, email FROM users WHERE role = 'client' AND company_id IS NULL;
-- Ordens de trabalho e faturas órfãs:
--   SELECT id, ref FROM work_orders WHERE client_id IS NULL OR company_id IS NULL;
--   SELECT id, ref FROM invoices    WHERE client_id IS NULL OR company_id IS NULL;
