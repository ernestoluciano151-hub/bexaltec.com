# Deploy — Bexaltec (Next.js 14 · PostgreSQL · Docker · VPS Hetzner)

> Actualizado a 24 de Novembro de 2026: saída da Vercel e do Neon para um VPS
> próprio com Docker Compose. Plano completo e decisões: proposta interna de
> migração (fora do repositório).

```
Visitante ─▶ Cloudflare (proxy) ─▶ caddy :443 ─▶ web (Next.js :3000) ─▶ db (PostgreSQL)
                                                   backup (pg_dump diário) ─▶ ./backups
```

Só o Caddy publica portas (80/443). A aplicação e a base não são acessíveis de fora.

---

## 1. Variáveis de ambiente

No servidor, num ficheiro `.env` na raiz do projecto — **nunca no git**:

```bash
cp deploy/env.example .env && chmod 600 .env
openssl rand -hex 24        # → POSTGRES_PASSWORD (só letras e números)
openssl rand -base64 48     # → JWT_SECRET
```

| Variável | Notas |
|---|---|
| `POSTGRES_PASSWORD` | Senha da base. O `DATABASE_URL` da aplicação é montado pelo `docker-compose.yml` |
| `JWT_SECRET` | Mínimo 32 caracteres. Sem ela a aplicação não arranca. Ao mudá-la, todas as sessões terminam |
| `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` | Email dos pedidos de orçamento (secção 5) |
| `SITE_DOMAIN`, `APEX_DOMAIN`, `CADDY_TLS` | Domínios e certificado servidos pelo Caddy |
| `BACKUP_TIME_UTC`, `BACKUP_KEEP_DAYS`, `BACKUP_KEEP_WEEKS` | Hora e retenção das cópias |

Em desenvolvimento usa-se `.env.local` (ver `.env.example`).

---

## 2. Primeira instalação no servidor

Pré-requisitos: Ubuntu 24.04, Docker Engine com o plugin Compose, acesso só por
chave SSH, firewall da Hetzner com 80/443 abertas apenas aos endereços da
Cloudflare e 22 apenas aos IPs da Bexaltec. O Docker contorna o `ufw` nas
portas que publica — a protecção tem de estar na firewall da Hetzner.

```bash
git clone https://github.com/ernestoluciano151-hub/bexaltec.com.git /srv/bexaltec
cd /srv/bexaltec
cp deploy/env.example .env && chmod 600 .env     # preencher
mkdir -p certs && chmod 700 certs                 # origin.pem + origin-key.pem (Cloudflare)
docker compose up -d db
docker compose run --rm migrate                   # só com base vazia (ver abaixo)
docker compose up -d --build
curl -fsS https://www.bexaltec.com/api/health     # {"ok":true}
```

**Certificado:** Cloudflare → SSL/TLS → *Origin Server* → *Create Certificate*
para `bexaltec.com` e `*.bexaltec.com`; guardar como `certs/origin.pem` e
`certs/origin-key.pem` (permissões 600). Em SSL/TLS → *Overview*, modo
**Full (strict)**.

**DNS (Cloudflare, proxy activo):** `www` e `@` em A → IPv4 do servidor e AAAA →
IPv6 do servidor. O Caddy redirecciona `bexaltec.com` para `https://www.bexaltec.com`.

### Trazer os dados do Neon (uma vez, no corte)

Neste caso **não se corre** o `migrate` na base vazia (passo acima): as tabelas
vêm do Neon e o `pg_restore` falharia sobre tabelas já criadas.

```bash
# Com o site antigo em manutenção (ninguém a escrever):
docker compose up -d db backup
docker compose exec backup sh -c 'pg_dump -Fc --no-owner --no-acl \
  -f /backups/neon_final.dump "postgresql://…neon…?sslmode=require"'
docker compose exec backup sh -c 'export PGPASSWORD=$POSTGRES_PASSWORD; \
  pg_restore -h db -U $POSTGRES_USER -d $POSTGRES_DB --no-owner /backups/neon_final.dump'
docker compose run --rm migrate --baseline        # as 0001–0003 já vêm aplicadas
docker compose run --rm migrate --status
docker compose up -d --build
```

Conferir a contagem de linhas por tabela nos dois lados e os valores de
`ref_sequences` antes de mudar o DNS. A versão do `pg_dump` (17) tem de ser
igual ou superior à do servidor Neon.

---

## 3. Publicar uma nova versão

```bash
cd /srv/bexaltec
git pull
docker compose run --rm migrate          # aplica as migrações novas, se houver
docker compose up -d --build web
curl -fsS https://www.bexaltec.com/api/health
```

**Migrações:** ficheiros SQL em `src/db/migrations/`, numerados (`0004_…sql`).
O `deploy/scripts/migrate.sh` aplica por ordem os que faltam, cada um numa
transacção, e regista-os na tabela `schema_migrations`. Nunca alterar uma
migração já aplicada — criar uma nova.

**Voltar à versão anterior:** `git checkout <commit-anterior>` e
`docker compose up -d --build web`. Migrações já aplicadas não se desfazem
sozinhas: escrevê-las de forma compatível com a versão anterior.

### Criar o primeiro administrador

O registo público cria sempre contas `client`. Criar a conta pelo portal e depois:

```bash
docker compose exec db psql -U bexaltec -d bexaltec \
  -c "UPDATE users SET role = 'admin' WHERE email = 'o-seu-email@bexaltec.com';"
```

Se a base veio do Neon e a conta antiga `admin@bexaltec.ao` existir, desactivá-la
(ver `src/db/scripts/crm_correccao_dados.sql`, consulta 3e).

---

## 4. Cópias de segurança

O contentor `backup` faz um `pg_dump` por dia às `BACKUP_TIME_UTC` para
`./backups/daily` (14 dias) e, ao domingo, para `./backups/weekly` (8 semanas).
Cada cópia é lida de volta (`pg_restore --list`) logo depois de feita.

```bash
docker compose exec backup sh /scripts/backup.sh      # cópia imediata
docker compose logs backup                            # histórico
```

**Repor uma cópia** (testar mensalmente numa base à parte):

```bash
docker compose exec backup sh -c 'export PGPASSWORD=$POSTGRES_PASSWORD; \
  createdb -h db -U $POSTGRES_USER teste_reposicao && \
  pg_restore -h db -U $POSTGRES_USER -d teste_reposicao --no-owner /backups/daily/<ficheiro>.dump'
```

> ⚠️ Estas cópias ficam no próprio servidor. **Falta a cópia para fora do
> servidor** (Storage Box da Hetzner) — Fase 3 da migração. Até lá, os backups
> da Hetzner são a única protecção contra a perda do servidor.

**Logs:** `docker compose logs -f web` (aplicação) e `docker compose logs -f caddy`.

---

## 5. Onde chegam os pedidos de orçamento

O formulário em `/quote` grava na tabela `quotes` e cria uma notificação para
todas as contas com papel `admin`.

- Ver e gerir: **Portal Admin → Orçamentos** (`/admin/quotes`)
- Estados: Novo → Em análise → Proposta enviada → Aceite / Recusado / Expirado
- O cliente vê os seus pedidos em **Portal do Cliente → Orçamentos**

### Email dos pedidos de orçamento

Cada pedido submetido em `/quote` é enviado para **info@bexaltec.com**, com o
*reply-to* definido para o email do cliente — responder no Outlook responde
diretamente a ele. A notificação dentro do portal continua a existir.

**Para o email funcionar são precisos três passos:**

1. Criar conta em [resend.com](https://resend.com).
2. **Domains → adicionar `bexaltec.com`** e publicar no DNS os registos SPF e DKIM
   que o Resend indicar. Sem o domínio verificado o envio é recusado.
3. **API Keys → criar chave** e pôr as três variáveis (`RESEND_API_KEY`,
   `MAIL_FROM`, `MAIL_TO`) no `.env` do servidor e reiniciar: `docker compose up -d web`.

**Enquanto não estiver configurado**, o comportamento é deliberado e honesto: o
pedido **é gravado na base de dados e aparece em `/admin/quotes`**, não se perde
nada, mas não sai email. O servidor regista um aviso nos logs da aplicação (`docker compose logs web`) e o
cliente vê, no ecrã de confirmação, uma linha a sugerir o WhatsApp se o assunto
for urgente. **Em nenhum caso o site diz que enviou um email que não enviou.**

> Alternativa ao Resend: o Microsoft 365 permite envio por SMTP, mas exige SMTP
> AUTH activo na caixa. A integração usa a API HTTP do Resend, que não depende
> de portas SMTP abertas no servidor.

---

## 6. Contactos publicados no site

Todos os contactos vêm de um único ficheiro: **`src/lib/contact.ts`**.
Alterar aí reflete-se no rodapé, na página de contacto, no orçamento, na
faturação e na página de suporte.

```ts
phoneDisplay: '+244 938 457 563'
whatsapp:     '244938457563'
email:        'info@bexaltec.com'
site:         'bexaltec.com'
```

As imagens das assinaturas de email vivem em `public/email/`
(`bexaltec-assinatura.png` e `bexaltec-rodape.png`) e são servidas em
`https://www.bexaltec.com/email/…`. Têm de estar publicadas para o logótipo
aparecer nas assinaturas do Outlook.

---

## 7. Por fazer (por ordem de prioridade)

Pontos da auditoria de Setembro de 2026 ainda por resolver — ver
`AUDITORIA_GERAL_2026-09.md`.

- [ ] **Responsividade**: 68 grelhas de colunas fixas; portal com sidebar fixa de 240 px sem menu mobile
- [ ] **SEO**: falta a imagem Open Graph (1200×630) — o sitemap, o `robots.txt` e o `metadataBase` já estão feitos
- [ ] **Páginas em falta**: `/privacy`, `/terms` e `/blog` estão ligadas no rodapé mas não existem (404)
- [ ] Nome do utilizador em branco na sidebar (`getUser()` devolve `name: ''`)
- [ ] Layouts do portal são client-side e anulam o SSR
- [ ] Verificação de propriedade em `addTicketMessage` e `markNotificationRead`
- [ ] Recuperação de senha (o limite de tentativas no login já está feito)
- [x] Registo descarta o campo "empresa" — agora notifica os administradores
- [ ] Contraste de `--slate` e `--muted` abaixo do mínimo WCAG AA
- [ ] Email automático ao receber pedidos de orçamento
- [ ] Estatísticas de visitas (a Vercel Analytics deixa de existir; ver Cloudflare Web Analytics)
