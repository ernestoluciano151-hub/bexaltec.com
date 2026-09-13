# Auditoria Geral — Site Bexaltec

**Data:** 2 de Setembro de 2026
**Projeto analisado:** `~/Downloads/bexaltec` · Next.js 14.2 · App Router · TypeScript · Drizzle + Neon Postgres
**Âmbito:** código, segurança, SEO, conteúdo, acessibilidade, UX/responsividade, performance
**Verificações executadas:** `tsc --noEmit` (0 erros) · `next build` (compila e gera 71 rotas com sucesso)

---

## Resumo executivo

A **base técnica é boa**: a autenticação usa JWT assinado em cookie httpOnly com bcrypt, o middleware verifica a assinatura antes de dar acesso a `/admin`, todas as rotas de API admin validam o papel do utilizador, e o esquema da base de dados tem chaves estrangeiras, restrições únicas e índices adequados. O projeto compila sem um único erro de tipagem.

O problema não é a engenharia — **é o que o site faz (e não faz) quando um cliente real o usa**. Encontrei seis falhas críticas, e três delas fazem o site prometer ao cliente algo que não acontece:

- O **formulário de orçamento não envia nada**. Mostra "Orçamento Enviado! Entraremos em contacto em até 24 horas" e deita os dados fora. Todos os leads estão a ser perdidos.
- O **chat de suporte é falso**. As mensagens ficam na memória do browser. Um cliente que reporte uma avaria por ali não fala com ninguém.
- Várias páginas do portal mostram **dados inventados de terceiros** — "Banco Nacional Lda", "Hotel Presidente", faturas e agendamentos fictícios — a qualquer cliente que faça login.

Nota importante: o formulário de orçamento falso e o telefone em placeholder **já tinham sido reportados como críticos na auditoria de Julho de 2026** (`AUDITORIA_Bexaltec_Website.md`). O site foi reconstruído de HTML único para Next.js, mas estes dois problemas transitaram intactos.

**Veredicto:** o site não deve ser divulgado comercialmente no estado atual. Com 2–3 dias de trabalho focado nos pontos 🔴, fica apresentável; a responsividade (🟠 7 e 8) é o trabalho maior, cerca de uma semana.

---

## 🔴 Crítico — resolver antes de divulgar o site

### 1. O formulário de orçamento não envia nada
`src/app/quote/page.tsx:33-43`

```ts
const handleSubmit = async (e) => {
  e.preventDefault()
  setSubmitting(true)
  await new Promise(r => setTimeout(r, 1200))   // ← espera fingida
  const ref = `BX-ORC-${...}${Math.floor(Math.random()*9000)+1000}`
  setFormSent(true)
  // TODO: POST to Formspree or email API
}
```

Simula 1,2 s de espera, gera uma referência aleatória e mostra: *"Recebemos o seu pedido e entraremos em contacto em até 24 horas úteis."* Nenhum email é enviado, nada é gravado. O cliente fica à espera de uma resposta que nunca virá, e a Bexaltec perde 100% dos pedidos.

**Correção:** já existe base de dados e Server Actions no projeto — o caminho mais coerente é criar uma tabela `quotes` e uma action `createQuote`, com notificação por email. Alternativa rápida (30 min): POST para Formspree, como previsto no `.env.local.example`.

---

### 2. Chave JWT com valor por omissão embutido no código
`src/middleware.ts:12` e `src/lib/auth-server.ts:11`

```ts
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bexaltec-dev-secret-change-in-production-min-32-chars'
)
```

Se a variável `JWT_SECRET` faltar ou vier vazia no Vercel, a aplicação **não falha** — passa silenciosamente a assinar e validar tokens com uma chave que está no repositório. Quem tiver acesso ao código pode forjar um token com `role: "admin"` e entrar no CRM completo: clientes, faturação, contratos.

**Correção:** falhar em arranque, como já se faz com a base de dados em `lib/db.ts`:

```ts
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não definido')
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
```

E rodar a chave atual, já que esteve no código.

---

### 3. Server Action pública sem autenticação
`src/lib/actions/admin.ts` → `sendNotification()`

É a única action do ficheiro **sem** verificação de sessão. Como toda a Server Action é exposta como endpoint HTTP, qualquer pessoa na internet pode enviar notificações com título, texto e link arbitrários a qualquer `userId` — um vetor de phishing dentro do próprio portal ("Clique aqui para regularizar a sua fatura").

Agrava-se por não ter utilidade: a função **não é chamada em lado nenhum da interface**.

**Correção:** apagar a função, ou acrescentar-lhe o mesmo `getSession()` + `role !== 'admin'` das restantes.

---

### 4. O chat de suporte é uma encenação
`src/app/dashboard/chat/page.tsx`

Sob o título *"Comunicação direta com a equipa técnica Bexaltec"*, a página arranca com uma conversa pré-escrita e guarda as mensagens novas apenas em `useState`. Fecha-se o separador e desaparecem. Nenhuma mensagem chega à Bexaltec.

**Correção:** ou ligar à tabela `ticket_messages` (que já existe e já tem a action `addTicketMessage`), ou remover a página do menu até estar pronta. Manter um canal de suporte falso é pior do que não ter canal nenhum.

---

### 5. Dados fictícios de terceiros visíveis a clientes reais
`admin/parts`, `admin/repair-queue`, `admin/schedule`, `dashboard/downloads`, `dashboard/history`, `dashboard/quotes`, `dashboard/renewals`

Dez das cerca de trinta páginas do portal têm os dados escritos à mão no código, sem qualquer ligação à base de dados. Não são placeholders neutros — são nomes de empresas e pessoas com aparência real:

- `admin/schedule`: *"08:00 · Carlos F. · Banco Nacional Lda · Visita manutenção mensal · Luanda — Ingombotas"*
- `admin/repair-queue`: *"LAB-2025-0042 · iPhone 15 Pro Max · Ana Costa"*
- `dashboard/downloads`: seis documentos inventados com botão "Baixar" que não faz nada
- `dashboard/history`: *"Fatura emitida — FAT-2024-0089 — 850.000 AOA"*

Um cliente da Bexaltec que faça login vê o histórico financeiro e a agenda de outra empresa. Mesmo sendo ficção, a leitura de quem está do outro lado é de fuga de dados.

**Correção:** ligar às queries que já existem (`getAllParts`, `getAllRepairs`, `getClientInvoices`…) ou substituir por `EmptyState`, como já foi feito bem em `admin/services`.

---

### 6. Contactos em placeholder em todas as páginas
`src/components/ui/Footer.tsx:69` · `src/app/contact/page.tsx:31,73-76`

- Telefone: **`+244 9XX XXX XXX`** — no rodapé de todas as páginas e no cartão principal da página de Contacto
- Mapa: caixa cinzenta com *"Mapa a ser integrado (Google Maps / Apple Maps)"*
- Redes sociais: WhatsApp, LinkedIn, Facebook e Instagram todos com `href: '#'`
- Email e telefone não são clicáveis (faltam `mailto:` e `tel:`)
- A página de Contacto **não tem formulário** — o único caminho é o `/quote`, que não funciona (ponto 1)

A página de contacto é o destino final de quem decidiu comprar. Neste momento não há forma de chegar à empresa.

---

## 🟠 Alto — corrigir nas próximas duas semanas

### 7. O portal do cliente é inutilizável em telemóvel
`dashboard/layout.tsx:47-56`, `admin/layout.tsx`, `components/ui/Sidebar.tsx:28-38`

A sidebar é `position: fixed; width: 240px` e o conteúdo tem `marginLeft: 240`. Num ecrã de 375 px sobram **135 px** para todo o conteúdo, sem menu hamburger e sem forma de fechar a sidebar.

Curiosamente a solução já está escrita: `globals.css:191-198` define `.sidebar-layout` com `@media (max-width: 768px)` — e essa classe **nunca é usada em lado nenhum**.

### 8. O site público praticamente não é responsivo
Contei **68 grelhas com colunas fixas** (`gridTemplateColumns: '1fr 1fr'`, `'repeat(4,1fr)'`) contra apenas 23 responsivas (`auto-fit`/`minmax`). Como o layout é feito com `style={{...}}` inline (1577 ocorrências), não há media queries possíveis.

Os breakpoints do Tailwind (`md:`, `lg:`) aparecem em **3 sítios, todos na NavBar**. Fora da barra de navegação, o site é desktop-only. Casos piores: `page.tsx:152` e as 11 páginas de serviço usam `'1fr 1fr'` com `gap: 4rem` — em telemóvel dá duas colunas de ~120 px.

Em Angola a esmagadora maioria do tráfego é móvel. **Esta é a correção com maior retorno depois dos pontos críticos.**

### 9. SEO substancialmente incompleto
| Problema | Onde | Efeito |
|---|---|---|
| `sitemap.xml` só tem a homepage | `public/sitemap.xml` | 17 das 18 páginas públicas ficam de fora |
| `robots.txt` com `Allow: /` | `public/robots.txt` | `/admin`, `/dashboard` e `/api` ficam abertos aos crawlers |
| Sem `metadataBase` | `app/layout.tsx` | URLs Open Graph resolvem mal |
| **Sem imagem OG** | todas | Partilhas no WhatsApp e LinkedIn saem sem imagem, apesar do `summary_large_image` declarado |
| Sem `canonical` | todas | Risco de conteúdo duplicado |
| Sem JSON-LD | todas | Sem `LocalBusiness`/`Organization`, perde-se presença local no Google |
| Domínio inconsistente | `.env.example` diz `www.bexaltec.com`, o resto do código diz `bexaltec.ao` | Confusão de canónico |
| `lang="pt"` | `layout.tsx:53` | Melhor `pt-AO` |

O trabalho de SEO por página está bem feito (11 páginas de serviço com `metadata` próprio) — falta a infraestrutura à volta.

### 10. Links partidos no rodapé de todas as páginas
`components/ui/Footer.tsx` aponta para `/blog`, `/privacy` e `/terms`. **Nenhuma destas rotas existe** → 404 a partir de qualquer página do site.

A Política de Privacidade não é só um link partido: o portal recolhe nome, email, telefone, empresa e equipamentos de clientes. É matéria da Lei n.º 22/11 de Proteção de Dados.

### 11. O nome do utilizador aparece em branco no portal
`src/lib/auth.ts:34-41` → `getUser()` devolve `{ id: 0, name: '', email: '', role }`.

`Sidebar.tsx:63` faz `user.name.charAt(0).toUpperCase()` e `Sidebar.tsx:67` mostra `{user.name}`. Resultado: **círculo de avatar vazio e nome em branco** na sidebar e na barra superior, para todos os utilizadores autenticados. A linha `user.company || user.email` também fica vazia.

### 12. Layouts do portal anulam o Server-Side Rendering
`dashboard/layout.tsx:31-44` e `admin/layout.tsx`

Ambos são `'use client'` e fazem a verificação de sessão em `useEffect`, devolvendo `"A carregar..."` até a hidratação terminar. Como o layout regressa cedo, o HTML já renderizado no servidor por `dashboard/page.tsx` (que é um Server Component correto) **nunca chega a aparecer** antes do JavaScript carregar. Ecrã de loading em cada navegação, sem necessidade — o `middleware.ts` já garante a proteção.

### 13. Duas Server Actions sem verificação de propriedade (IDOR)
`src/lib/actions/tickets.ts` → `addTicketMessage(ticketId, body)` verifica que há sessão, mas não que o ticket pertence a quem escreve. Qualquer cliente autenticado pode escrever no ticket de outra empresa.
`src/lib/actions/admin.ts` → `markNotificationRead(notifId)` tem o mesmo padrão.

### 14. Portal sem recuperação de senha e sem limite de tentativas
- `login/page.tsx:96` — o botão "Esqueceu a senha?" é um `<button type="button">` sem `onClick`. Não existe fluxo de recuperação: um cliente que perca a senha fica bloqueado.
- `api/auth/login/route.ts` não tem rate limiting nem bloqueio após N falhas — força bruta livre.
- O login também ignora o `?redirect=` que o próprio middleware coloca no URL (`middleware.ts:27`).

### 15. O campo "empresa" do registo é descartado em silêncio
`register/page.tsx:24` envia `company`, `api/auth/register` passa-o adiante, e `auth-server.ts → registerUser()` aceita-o na assinatura mas **nunca o grava** (insere sempre `companyId: null`). O utilizador preenche, e a informação desaparece.

Na mesma página, o placeholder da senha diz *"Mínimo 6 caracteres"* mas a validação exige 8.

---

## 🟡 Médio — qualidade e acessibilidade

### 16. Contraste abaixo do mínimo WCAG AA
Calculado sobre os tokens de `globals.css`:

| Cor | Fundo | Rácio | WCAG AA (4.5:1) |
|---|---|---|---|
| `--muted` `#37474F` | `--navy3` `#06101E` | **1.98:1** | Falha grave |
| `--slate` `#546E7A` | `--card` `#0D1F3A` | **3.05:1** | Falha |
| `--slate` `#546E7A` | `--navy` `#0A1628` | **3.36:1** | Falha |
| `--forest` `#00796B` | `--navy3` `#06101E` | **3.59:1** | Falha |
| `--text2` `#90A4AE` | `--navy` | 7.00:1 | OK |
| `--green` `#00E676` | `--navy` | 10.86:1 | OK |

`--slate` é usado **193 vezes** e `--muted` 34 — e quase sempre em texto de 10 a 12 px (344 ocorrências de `fontSize` entre 10 e 12). Texto pequeno e de baixo contraste é a combinação pior. Subir `--slate` para cerca de `#7A96A5` e `--muted` para `#5A7280` resolve a maior parte sem mexer no aspeto.

### 17. Indicador de foco removido dos formulários
`globals.css:135` — `.input-field { outline: none }`, substituído só por `border-color: rgba(0,230,118,0.25)`, praticamente invisível. Quem navega por teclado perde a noção de onde está. Usar `:focus-visible` com um `outline` de 2 px verde.

Também em falta: `aria-label` (só 1 em todo o projeto, na NavBar), `alt` em imagens, e `prefers-reduced-motion`.

### 18. Marcadores de "por fazer" visíveis ao público
- `page.tsx:265` e `services/laboratory/page.tsx:261` — *"Espaço reservado · vturb / YouTube / Vimeo"* visível no site em produção
- `services/infrastructure/page.tsx:232,276` — galerias de fotos por preencher
- `admin/technicians`, `admin/reports` — botões "Em breve" desativados

A menção a **vturb** (plataforma de VSL brasileira) num site institucional de TI destoa da marca. Substituir por vídeo real ou remover a secção.

### 19. Código morto acumulado
| Ficheiro / recurso | Tamanho | Situação |
|---|---|---|
| `src/lib/translations.ts` | 15,5 KB | Traduções PT/EN completas, **nunca importadas**. O site não tem seletor de idioma. |
| `src/lib/mock-data.ts` | 9,2 KB | Sem um único importador |
| `src/app/api/client/*` (5 rotas) | — | Nunca chamadas — as páginas do cliente usam Server Components |
| 5 queries (`getTicketById`, `getAllTechnicians`, `getClientWorkOrders`, `getCompanyById`, `getActiveContracts`) | — | Exportadas e não usadas |
| `next.config.ts` | — | Ficheiro-comentário a dizer que foi substituído por `next.config.js` |
| `robots.txt` e `sitemap.xml` na raiz | — | Duplicados dos de `public/`; os da raiz não são servidos |
| `.env.local.example` | — | Refere Supabase e Formspree, que o projeto já não usa (usa Neon + JWT próprio) |
| Actions sem interface | — | `createRepair` (o cliente não consegue pedir uma reparação) e `assignTicket` (o admin não consegue atribuir técnico) |

`getTicketById` não usada significa também que **não existe ecrã de detalhe de ticket com histórico de mensagens** — o cliente abre o ticket e não vê a resposta.

### 20. Pedidos redundantes no dashboard admin
`admin/page.tsx:41-51` faz três `fetch` em paralelo, mas `/api/admin/dashboard` já devolve `kpis`, `tickets` e `workOrders`. Os outros dois pedidos repetem as mesmas queries à base de dados e o resultado é descartado (`dash.tickets ?? t.tickets`). Três round-trips e o dobro das queries onde bastava um.

Nenhum destes `fetch` verifica `res.ok` nem tem `.catch()` — se a sessão expirar, a página mostra-se vazia sem qualquer aviso.

### 21. Sem analytics
Não há Google Analytics, Vercel Analytics nem qualquer medição. Não é possível saber quantas visitas o site recebe nem de onde vêm.

---

## 🟢 O que está bem feito

| Área | Detalhe |
|---|---|
| **Autenticação** | JWT assinado (jose HS256) em cookie `httpOnly`, bcrypt com 12 rounds, middleware que verifica criptograficamente a assinatura antes de decidir o papel — sem confiar em cookies não assinados |
| **Autorização da API** | As 11 rotas `/api/admin/*` verificam `session.role !== 'admin'` sem exceção. Nenhuma rota esquecida. |
| **Base de dados** | Esquema sólido: chaves estrangeiras com `ON DELETE` explícito, `UNIQUE` em emails, NIFs e referências, e 9 índices bem escolhidos (`tickets(client_id)`, `notifications(user_id, is_read)`…) |
| **Camada de cache** | `lib/cache.ts` com tags por entidade e TTLs diferenciados; invalidação dirigida após cada escrita |
| **Segurança HTTP** | `vercel.json` com `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` e `Permissions-Policy` |
| **Menu mobile** | A NavBar tem um menu completo com acordeão de dois níveis, bloqueio de scroll e `aria-label` — bem feito |
| **SEO por página** | 11 páginas de serviço com `metadata` próprio, títulos e descrições distintos e keywords localizadas |
| **Qualidade do código** | `tsc --noEmit` sem erros e `next build` limpo com `strict: true` |
| **Página 404** | Personalizada, com navegação útil |
| **Design** | Identidade coerente, tokens CSS bem organizados, tipografia consistente |

---

## Plano de ação priorizado

| # | Tarefa | Prioridade | Esforço |
|---|---|---|---|
| 1 | Ligar o formulário de orçamento (tabela `quotes` + email) | 🔴 | 3–4 h |
| 2 | Telefone, email clicável, redes sociais e mapa reais | 🔴 | 1 h |
| 3 | Remover o fallback do `JWT_SECRET` e rodar a chave | 🔴 | 15 min |
| 4 | Apagar ou proteger `sendNotification` | 🔴 | 10 min |
| 5 | Desativar o chat falso (ou ligá-lo a `ticket_messages`) | 🔴 | 30 min / 1 dia |
| 6 | Substituir dados fictícios por dados reais ou `EmptyState` | 🔴 | 1 dia |
| 7 | Sidebar responsiva no portal (usar a `.sidebar-layout` já escrita) | 🟠 | 4 h |
| 8 | Responsividade do site público (68 grelhas fixas) | 🟠 | 3–5 dias |
| 9 | Sitemap completo, robots, `metadataBase`, imagem OG, JSON-LD | 🟠 | 3 h |
| 10 | Criar `/privacy` e `/terms`; remover ou criar `/blog` | 🟠 | 3 h |
| 11 | Corrigir nome vazio na sidebar (`getUser`) | 🟠 | 30 min |
| 12 | Tornar os layouts do portal Server Components | 🟠 | 2 h |
| 13 | Verificação de propriedade em `addTicketMessage` e `markNotificationRead` | 🟠 | 1 h |
| 14 | Recuperação de senha + rate limiting no login | 🟠 | 1 dia |
| 15 | Gravar a empresa no registo; corrigir "mínimo 6/8" | 🟠 | 30 min |
| 16 | Subir contraste de `--slate` e `--muted` | 🟡 | 1 h |
| 17 | `:focus-visible` nos formulários | 🟡 | 30 min |
| 18 | Remover placeholders visíveis (vturb, galerias, mapa) | 🟡 | 1 h |
| 19 | Limpar código morto (~25 KB + 5 rotas + 5 queries) | 🟡 | 2 h |
| 20 | Um único pedido no dashboard admin + tratamento de erros | 🟡 | 1 h |
| 21 | Instalar Vercel Analytics | 🟡 | 15 min |

**Sequência sugerida:** pontos 1 a 6 antes de qualquer divulgação (2–3 dias) → 7 a 15 na quinzena seguinte → 16 a 21 quando houver folga.

---

## Anexo — metodologia

- 127 ficheiros do projeto analisados (todo o `src/`, `public/` e configuração)
- `npm install` + `npx tsc --noEmit` → **0 erros**
- `npx next build` → **sucesso**, 71 rotas geradas, 87,3 KB de JS partilhado (valor saudável)
- Rácios de contraste calculados pela fórmula WCAG 2.1 sobre os tokens de `globals.css`
- Contagens de padrões (grelhas, breakpoints, tokens de cor, chamadas de API) obtidas por varrimento do código

*Auditoria realizada por Claude · Cowork · 2 de Setembro de 2026*
