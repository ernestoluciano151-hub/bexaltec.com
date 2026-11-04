-- ─── Bexaltec · Correcção de dados do CRM ──────────────────────────────────
-- Executar no editor SQL do Neon DEPOIS da migração 0003_crm_quick_fixes.sql.
-- Correr bloco a bloco, pela ordem. Os blocos 1 e 2 corrigem sozinhos o que
-- tem uma resposta única; o bloco 3 mostra o que sobra; os blocos 4 e 5 são
-- modelos para fundir duplicados depois de decidir à mão.
-- Recomendado: criar antes um branch de segurança no Neon (Branches → Create).


-- ═══ BLOCO 1 · Completar a empresa a partir do cliente ═════════════════════
-- Seguro: só preenche o que está vazio, com a empresa que já está na ficha
-- do cliente (ou na OT de origem). Não altera nada que já tenha valor.
BEGIN;

-- Faturas sem cliente mas ligadas a uma OT → cliente da OT
UPDATE invoices i SET client_id = w.client_id, updated_at = NOW()
  FROM work_orders w
 WHERE i.work_order_id = w.id AND i.client_id IS NULL AND w.client_id IS NOT NULL;

-- Faturas sem empresa → empresa da OT, senão a do cliente
UPDATE invoices i SET company_id = w.company_id, updated_at = NOW()
  FROM work_orders w
 WHERE i.work_order_id = w.id AND i.company_id IS NULL AND w.company_id IS NOT NULL;
UPDATE invoices i SET company_id = u.company_id, updated_at = NOW()
  FROM users u
 WHERE i.client_id = u.id AND i.company_id IS NULL AND u.company_id IS NOT NULL;

-- OT, tickets, reparações e equipamento sem empresa → empresa do cliente
UPDATE work_orders t SET company_id = u.company_id, updated_at = NOW()
  FROM users u WHERE t.client_id = u.id AND t.company_id IS NULL AND u.company_id IS NOT NULL;
UPDATE tickets t SET company_id = u.company_id, updated_at = NOW()
  FROM users u WHERE t.client_id = u.id AND t.company_id IS NULL AND u.company_id IS NOT NULL;
UPDATE repair_jobs t SET company_id = u.company_id, updated_at = NOW()
  FROM users u WHERE t.client_id = u.id AND t.company_id IS NULL AND u.company_id IS NOT NULL;
UPDATE equipment t SET company_id = u.company_id, updated_at = NOW()
  FROM users u WHERE t.client_id = u.id AND t.company_id IS NULL AND u.company_id IS NOT NULL;

COMMIT;


-- ═══ BLOCO 2 · Associar clientes sem empresa, quando a resposta é única ════
-- Critério A: o domínio do email do cliente é o domínio do email ou do site
--             de UMA só empresa (gmail, hotmail, etc. são ignorados).
-- Critério B: o cliente fez um pedido de orçamento com o nome exacto de UMA
--             só empresa.
-- 2a. PRÉ-VISUALIZAR (não altera nada):
WITH free(d) AS (VALUES ('gmail.com'),('googlemail.com'),('hotmail.com'),('hotmail.pt'),('outlook.com'),
       ('outlook.pt'),('live.com'),('msn.com'),('yahoo.com'),('yahoo.com.br'),('icloud.com'),('me.com'),
       ('sapo.pt'),('sapo.ao'),('proton.me'),('protonmail.com'),('aol.com'),('gmx.com'),('mail.com')),
dom AS (
  SELECT id AS company_id, split_part(lower(trim(email)), '@', 2) AS d
    FROM companies WHERE is_active AND email LIKE '%@%'
  UNION
  SELECT id, regexp_replace(lower(trim(website)), '^(https?://)?(www\.)?([^/:?#]+).*$', '\3')
    FROM companies WHERE is_active AND coalesce(trim(website), '') <> ''
),
by_domain AS (
  SELECT u.id AS user_id, min(dom.company_id) AS company_id, 'domínio do email' AS criterio
    FROM users u JOIN dom ON dom.d = split_part(lower(u.email), '@', 2)
   WHERE u.role = 'client' AND u.company_id IS NULL
     AND split_part(lower(u.email), '@', 2) NOT IN (SELECT d FROM free)
   GROUP BY u.id HAVING count(DISTINCT dom.company_id) = 1
),
by_quote AS (
  SELECT u.id AS user_id, min(c.id) AS company_id, 'pedido de orçamento' AS criterio
    FROM users u
    JOIN quotes q    ON q.client_id = u.id
    JOIN companies c ON c.is_active AND lower(trim(c.name)) = lower(trim(q.company))
   WHERE u.role = 'client' AND u.company_id IS NULL
   GROUP BY u.id HAVING count(DISTINCT c.id) = 1
),
proposta AS (
  SELECT * FROM by_domain
  UNION ALL
  SELECT * FROM by_quote WHERE user_id NOT IN (SELECT user_id FROM by_domain)
)
SELECT p.user_id, u.name, u.email, p.company_id, c.name AS empresa, p.criterio
  FROM proposta p JOIN users u ON u.id = p.user_id JOIN companies c ON c.id = p.company_id
 ORDER BY c.name, u.name;

-- 2b. APLICAR (depois de rever a lista acima — mesma lógica):
WITH free(d) AS (VALUES ('gmail.com'),('googlemail.com'),('hotmail.com'),('hotmail.pt'),('outlook.com'),
       ('outlook.pt'),('live.com'),('msn.com'),('yahoo.com'),('yahoo.com.br'),('icloud.com'),('me.com'),
       ('sapo.pt'),('sapo.ao'),('proton.me'),('protonmail.com'),('aol.com'),('gmx.com'),('mail.com')),
dom AS (
  SELECT id AS company_id, split_part(lower(trim(email)), '@', 2) AS d
    FROM companies WHERE is_active AND email LIKE '%@%'
  UNION
  SELECT id, regexp_replace(lower(trim(website)), '^(https?://)?(www\.)?([^/:?#]+).*$', '\3')
    FROM companies WHERE is_active AND coalesce(trim(website), '') <> ''
),
by_domain AS (
  SELECT u.id AS user_id, min(dom.company_id) AS company_id
    FROM users u JOIN dom ON dom.d = split_part(lower(u.email), '@', 2)
   WHERE u.role = 'client' AND u.company_id IS NULL
     AND split_part(lower(u.email), '@', 2) NOT IN (SELECT d FROM free)
   GROUP BY u.id HAVING count(DISTINCT dom.company_id) = 1
),
by_quote AS (
  SELECT u.id AS user_id, min(c.id) AS company_id
    FROM users u
    JOIN quotes q    ON q.client_id = u.id
    JOIN companies c ON c.is_active AND lower(trim(c.name)) = lower(trim(q.company))
   WHERE u.role = 'client' AND u.company_id IS NULL
   GROUP BY u.id HAVING count(DISTINCT c.id) = 1
),
proposta AS (
  SELECT * FROM by_domain
  UNION ALL
  SELECT * FROM by_quote WHERE user_id NOT IN (SELECT user_id FROM by_domain)
)
UPDATE users u SET company_id = p.company_id, updated_at = NOW()
  FROM proposta p WHERE u.id = p.user_id AND u.company_id IS NULL
RETURNING u.id, u.name, u.company_id;

-- 2c. Voltar a correr o BLOCO 1 para propagar as empresas acabadas de associar.


-- ═══ BLOCO 3 · O que sobra para decidir à mão (só leitura) ═════════════════
-- 3a. Clientes ainda sem empresa → associar no portal: Admin › Clientes › Editar
SELECT id, name, email, created_at FROM users
 WHERE role = 'client' AND company_id IS NULL ORDER BY created_at DESC;

-- 3b. OT e faturas sem cliente (não há de onde deduzir)
SELECT 'OT' AS tipo, id, ref, title AS descricao, created_at FROM work_orders WHERE client_id IS NULL
UNION ALL
SELECT 'Fatura', id, ref, coalesce(notes, total::text), created_at FROM invoices WHERE client_id IS NULL
ORDER BY created_at DESC;

-- 3c. Utilizadores com o mesmo email a menos de maiúsculas → BLOCO 4
SELECT lower(trim(email)) AS email, array_agg(id ORDER BY last_login_at DESC NULLS LAST, id) AS ids,
       array_agg(name ORDER BY last_login_at DESC NULLS LAST, id) AS nomes
  FROM users GROUP BY 1 HAVING count(*) > 1;

-- 3d. Empresas duplicadas (mesmo nome ou mesmo NIF) → BLOCO 5
SELECT lower(trim(name)) AS nome, array_agg(id ORDER BY id) AS ids, array_agg(nif ORDER BY id) AS nifs
  FROM companies GROUP BY 1 HAVING count(*) > 1;

-- 3e. Conta semeada antiga, cuja senha esteve publicada no repositório.
--     Se aparecer com is_active = true:
--     UPDATE users SET is_active = false WHERE email = 'admin@bexaltec.ao';
SELECT id, email, role, is_active, last_login_at FROM users WHERE lower(email) = 'admin@bexaltec.ao';


-- ═══ BLOCO 4 · Modelo: fundir dois utilizadores ════════════════════════════
-- Substituir 111 (fica) e 222 (sai). O primeiro id de cada linha de 3c é o que
-- entrou mais recentemente — normalmente o que deve ficar.
-- BEGIN;
-- UPDATE tickets         SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE tickets         SET assigned_to   = 111 WHERE assigned_to   = 222;
-- UPDATE ticket_messages SET author_id     = 111 WHERE author_id     = 222;
-- UPDATE repair_jobs     SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE repair_jobs     SET technician_id = 111 WHERE technician_id = 222;
-- UPDATE equipment       SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE work_orders     SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE work_orders     SET technician_id = 111 WHERE technician_id = 222;
-- UPDATE invoices        SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE quotes          SET client_id     = 111 WHERE client_id     = 222;
-- UPDATE notifications   SET user_id       = 111 WHERE user_id       = 222;
-- UPDATE users u SET company_id = coalesce(u.company_id, d.company_id),
--                    phone      = coalesce(u.phone, d.phone), updated_at = NOW()
--   FROM users d WHERE u.id = 111 AND d.id = 222;
-- DELETE FROM users WHERE id = 222;
-- UPDATE users SET email = lower(trim(email)) WHERE id = 111;
-- COMMIT;


-- ═══ BLOCO 5 · Modelo: fundir duas empresas ════════════════════════════════
-- Substituir 11 (fica) e 22 (sai).
-- BEGIN;
-- UPDATE users       SET company_id = 11 WHERE company_id = 22;
-- UPDATE tickets     SET company_id = 11 WHERE company_id = 22;
-- UPDATE repair_jobs SET company_id = 11 WHERE company_id = 22;
-- UPDATE equipment   SET company_id = 11 WHERE company_id = 22;
-- UPDATE work_orders SET company_id = 11 WHERE company_id = 22;
-- UPDATE contracts   SET company_id = 11 WHERE company_id = 22;
-- UPDATE invoices    SET company_id = 11 WHERE company_id = 22;
-- -- guarda a que sai e apaga-a antes, para libertar o NIF (restrição UNIQUE):
-- CREATE TEMP TABLE sai ON COMMIT DROP AS SELECT * FROM companies WHERE id = 22;
-- DELETE FROM companies WHERE id = 22;
-- UPDATE companies k SET nif = coalesce(k.nif, d.nif), email = coalesce(k.email, d.email),
--                        phone = coalesce(k.phone, d.phone), website = coalesce(k.website, d.website),
--                        address = coalesce(k.address, d.address), updated_at = NOW()
--   FROM sai d WHERE k.id = 11;
-- COMMIT;
