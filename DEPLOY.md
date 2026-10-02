# Deploy — Bexaltec (Next.js 14 · Neon Postgres · Vercel)

> Atualizado a 2 de Setembro de 2026, após a correção dos seis pontos críticos da auditoria.

---

## 1. Variáveis de ambiente (obrigatórias)

A aplicação **não arranca** sem estas duas. É intencional: um valor por omissão
na chave JWT permitiria a qualquer pessoa com acesso ao código forjar um token
de administrador.

| Variável | Onde obter | Notas |
|---|---|---|
| `DATABASE_URL` | Neon → projeto → *Connection string* | Terminar com `?sslmode=require` |
| `JWT_SECRET` | `openssl rand -base64 32` | Mínimo 32 caracteres. **Nunca** commitar. |
| `NEXT_PUBLIC_APP_URL` | — | `https://www.bexaltec.com` |

Localmente ficam em `.env.local`; na Vercel em **Project Settings → Environment Variables**
(marcar Production, Preview e Development).

> ⚠️ Se a chave `JWT_SECRET` já esteve alguma vez no código, gere uma nova.
> Ao mudar a chave, todas as sessões ativas terminam — os utilizadores voltam a entrar.

---

## 2. Base de dados

```bash
npm install
npm run db:push          # aplica o esquema a partir de src/lib/schema.ts
```

Em alternativa, executar os ficheiros SQL por ordem no console do Neon:

| Migração | Conteúdo |
|---|---|
| `src/db/migrations/0001_initial.sql` | Esquema base: utilizadores, empresas, tickets, reparações, equipamentos, peças, ordens de trabalho, contratos, faturas, notificações |
| `src/db/migrations/0002_quotes.sql` | **Tabela `quotes`** — necessária para o formulário de orçamento funcionar |

**A migração 0002 é obrigatória.** Sem ela o formulário de `/quote` devolve erro
ao cliente (e sugere o WhatsApp como alternativa), mas nada é gravado.

### Criar o primeiro administrador

Não há conta de administrador semeada, de propósito — a versão anterior desta
migração trazia `admin@bexaltec.ao` com uma senha fixa no repositório. **Se já
aplicou essa migração, desactive ou mude a senha dessa conta agora.**

O registo público cria sempre contas com papel `client`. Criar a conta pelo
portal e depois promovê-la:

```sql
UPDATE users SET role = 'admin' WHERE email = 'o-seu-email@bexaltec.com';
```

---

## 3. Correr localmente

```bash
npm run dev        # http://localhost:3000
npm run build      # verificação de produção
```

---

## 4. Deploy na Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importar o repositório
2. A Vercel deteta Next.js automaticamente
3. Definir as variáveis do ponto 1 **antes** do primeiro deploy
4. **Deploy**

Os cabeçalhos de segurança (`X-Frame-Options`, `nosniff`, `Referrer-Policy`,
`Permissions-Policy`) são aplicados por `vercel.json`.

### Domínio

O site está em **`www.bexaltec.com`**. O domínio nu (`bexaltec.com`, sem www)
**não tem registo de DNS** — não resolve. Por isso o canónico do site, o sitemap,
o `metadataBase` e as assinaturas de email usam todos `www.bexaltec.com`.

Para passar a usar o domínio nu: Vercel → **Settings → Domains** → adicionar
`bexaltec.com`, criar no registrar o registo A que a Vercel indicar, e só depois
trocar o canónico (é substituir `https://www.bexaltec.com` por `https://bexaltec.com`
em `contact.ts`, `layout.tsx`, `page.tsx`, nas duas páginas de serviço com `url:`,
no `sitemap.xml` e no `robots.txt`).

---

## 5. Onde chegam os pedidos de orçamento

O formulário em `/quote` grava na tabela `quotes` e cria uma notificação para
todas as contas com papel `admin`.

- Ver e gerir: **Portal Admin → Orçamentos** (`/admin/quotes`)
- Estados: Novo → Em análise → Proposta enviada → Aceite / Recusado / Expirado
- O cliente vê os seus pedidos em **Portal do Cliente → Orçamentos**

> Ainda **não há envio de email** automático ao receber um pedido. A notificação
> aparece dentro do portal. Para email, integrar Resend ou SendGrid em
> `src/lib/actions/quotes.ts`.

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
- [ ] Recuperação de senha e limite de tentativas no login
- [ ] Registo descarta o campo "empresa"
- [ ] Contraste de `--slate` e `--muted` abaixo do mínimo WCAG AA
- [ ] Email automático ao receber pedidos de orçamento
- [ ] Analytics (Vercel Analytics)
