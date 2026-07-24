# BEXALTEC — AUDITORIA TÉCNICA COMPLETA
## Fase 1 · Julho 2026

---

## 1. ESTRUTURA ATUAL DO PROJETO (19 ficheiros)

```
bexaltec/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout (fonte, SEO global)
│   │   ├── globals.css             ← Design tokens + utilitários CSS
│   │   ├── page.tsx                ⚠️ MEGA-FICHEIRO (540 linhas)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          ⚠️ Sidebar duplicada
│   │   │   ├── page.tsx
│   │   │   ├── tickets/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   └── billing/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx          ⚠️ Sidebar duplicada
│   │       ├── page.tsx
│   │       ├── clients/page.tsx
│   │       ├── tickets/page.tsx
│   │       └── services/page.tsx
│   ├── components/
│   │   └── Logo.tsx               ✅ Bom — reutilizável
│   └── lib/
│       ├── auth.ts                 ⚠️ localStorage (inseguro)
│       ├── mock-data.ts            ✅ Bem estruturado
│       └── translations.ts         ✅ Completo PT/EN
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml                 ⚠️ Só tem a homepage
├── package.json
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

**Inventário:** 1 componente reutilizável, 3 libs partilhadas, 14 páginas/layouts, 0 páginas de serviço individuais.

---

## 2. DEPENDÊNCIAS IDENTIFICADAS

### Dependências Externas
| Pacote | Versão | Uso |
|--------|--------|-----|
| next | ^14.2.0 | Framework principal |
| react | ^18.3.0 | UI |
| react-dom | ^18.3.0 | Render |
| lucide-react | ^0.383.0 | Ícones (instalado mas NÃO UTILIZADO) |
| tailwindcss | ^3.4.10 | CSS utility |
| typescript | ^5 | Tipagem |

### Dependências Internas (grafo)
```
page.tsx
  └── Logo.tsx
  └── translations.ts

dashboard/layout.tsx + admin/layout.tsx
  └── Logo.tsx
  └── auth.ts
        └── mock-data.ts (demoUser, demoAdmin)

dashboard/pages (×4)
  └── auth.ts
  └── mock-data.ts

admin/pages (×4)
  └── auth.ts
  └── mock-data.ts
```

---

## 3. COMPONENTES REUTILIZÁVEIS (existentes)

| Componente | Ficheiro | Estado |
|------------|----------|--------|
| BexaltecLogo | `Logo.tsx` | ✅ Completo, com variants |
| BexaltecBadge | `Logo.tsx` | ✅ Compacto para espaços pequenos |

**Componentes que deveriam existir mas não existem:**
- `<Sidebar>` — duplicado em dashboard e admin
- `<PageHeader>` — badge + h2 + p repetido 8× em page.tsx
- `<StatCard>` — duplicado em dashboard e admin
- `<TicketBadge>` — lógica de badge por status repetida
- `<NavBar>` — isolado da landing page
- `<Footer>` — isolado da landing page
- `<SectionWrapper>` — padding + maxWidth repetidos
- `<Modal>` — duplicado em clientes, tickets, serviços

---

## 4. CÓDIGO DUPLICADO (problemas críticos)

### 4.1 Sidebar — Duplicação Severa
`dashboard/layout.tsx` e `admin/layout.tsx` têm **260+ linhas idênticas** com diferenças mínimas (label "Área Administrativa", cor da badge de role). Qualquer mudança visual tem de ser feita em dois sítios.

### 4.2 Padrão Section Header — Repetido 8×
```tsx
// Repetido em cada secção da landing page:
<div className="section-badge">{tx.X.badge}</div>
<h2 className="font-rajdhani font-black" style={{...}}>{tx.X.title}</h2>
<p style={{...}}>{tx.X.desc}</p>
```
Aparece em: services, about, partners, methodology, caes, quote, contact — **8 repetições**.

### 4.3 Card com Ícone — Repetido 4×
Padrão `div[36×36 + ícone + título + descrição]` repetido em About, Quote info, Contact e em dashboard sem abstração.

### 4.4 Informação de Contacto — Duplicada
`info@bexaltec.ao` e `+244 9XX XXX XXX` aparecem em:
- Secção Quote (contacto direto)
- Secção Contact
- Footer

### 4.5 Inline Styles vs CSS Classes
O projeto tem `globals.css` com classes utilitárias (`.card-base`, `.btn-primary`, etc.) mas a maioria dos elementos usa `style={{}}` inline. Exemplo: `padding: '1.25rem'` aparece **dezenas de vezes** hardcoded.

### 4.6 `lucide-react` instalado mas não usado
Pacote ocupa espaço no bundle sem nenhum import activo.

---

## 5. PROBLEMAS DE UX

### 5.1 Landing Page Sobrecarregada ⚠️ CRÍTICO
A página atual tem **8 secções de conteúdo** numa só página de scroll:
Hero → Serviços (7 tabs, 26 cards) → Sobre → Parceiros (20) → Metodologia → CAEs (11) → Formulário → Contacto

O utilizador não consegue processar tanta informação. A taxa de conversão é baixa. Os dois maiores diferenciais (Laboratório e Infraestrutura) estão escondidos dentro de tabs genéricas.

### 5.2 Menu Mobile — Básico
Menu mobile actual: overlay com 6 links centrados. Sem categorias, sem submenus, sem organização de serviços. Não reflete a profundidade da oferta.

### 5.3 Sem Deep-linking
Todos os links são âncoras (`#servicos`, `#sobre`). O utilizador não pode copiar o URL de uma secção específica. O botão "voltar" do browser não funciona correctamente.

### 5.4 Sidebar Mobile Invisível
```tsx
className="hidden md:flex"
```
Em dispositivos móveis, a sidebar do dashboard e do admin desaparece completamente. Não existe menu hamburger alternativo no portal do cliente nem no admin — utilizadores mobile ficam presos.

### 5.5 Dashboard Hardcoded para clientId 'c1'
```tsx
const myTickets = mockTickets.filter(t => t.clientId === 'c1')
```
Os dados do dashboard não são dinâmicos — qualquer utilizador que faça login vê sempre os dados do João Ferreira (Sonaref Industrial).

### 5.6 Ícones Emoji em Contexto Empresarial
Os serviços usam emojis (🌐, 🖥️, ☁️, 📷, 🔑) em vez de ícones SVG profissionais. Em contexto B2B enterprise, emojis transmitem pouca credibilidade técnica. O pacote `lucide-react` está instalado mas não é usado.

### 5.7 Sem Feedback Visual de Carregamento
Não existem `loading.tsx`, Suspense boundaries, ou skeleton loaders. Ao navegar entre páginas do portal, o utilizador vê conteúdo a "piscar" sem transição.

### 5.8 Formulário de Orçamento — Sem Envio Real
O formulário tem um TODO comment há vários ficheiros:
```tsx
// TODO: POST to Formspree
```
O orçamento nunca chega à empresa.

---

## 6. PROBLEMAS DE SEO

### 6.1 Metadata Global Única ⚠️ CRÍTICO
```tsx
// src/app/layout.tsx — mesmo título em TODAS as páginas
title: 'Bexaltec — Soluções Informáticas · Luanda, Angola'
```
O `/dashboard`, `/login`, `/register`, `/admin` partilham o mesmo `<title>` e `<meta description>`. Os motores de busca veem conteúdo duplicado.

### 6.2 `'use client'` na Landing Page
A landing page inteira é `'use client'`, o que significa:
- Next.js não gera HTML estático (SSG desativado)
- Os bots de pesquisa recebem HTML vazio e esperam por JavaScript
- Sem streaming, sem React Server Components

### 6.3 Sem Schema.org / JSON-LD
Não existe markup estruturado para:
- `LocalBusiness` (empresa angolana em Luanda)
- `Service` (cada categoria de serviço)
- `BreadcrumbList` (navegação)
- `FAQPage` (metodologia/CAEs)

### 6.4 Sitemap Incompleto
```xml
<!-- sitemap.xml actual — apenas 1 URL -->
<loc>https://bexaltec.ao/</loc>
```
Quando existirem páginas de serviços, portfolio, blog, etc., o sitemap precisa de ser gerado dinamicamente.

### 6.5 Sem Breadcrumbs
Nenhuma página tem breadcrumbs. Importante para SEO de páginas de serviço individuais.

### 6.6 Sem `og:image`
O metadata tem OpenGraph configurado mas sem `og:image`. Os links partilhados em WhatsApp/LinkedIn mostram uma preview em branco.

### 6.7 `lang="pt"` fixo
```tsx
<html lang="pt">
```
O site tem toggle PT/EN mas o atributo `lang` do HTML nunca muda. Os motores de busca e leitores de ecrã usam sempre "pt" mesmo quando o utilizador está em inglês.

---

## 7. PROBLEMAS DE PERFORMANCE

### 7.1 Bundle JS Desnecessariamente Grande
A landing page é `'use client'` por completo. Isso significa que **todo o JavaScript** (servicesData, partners array, translations, todas as funções de UI) é enviado ao browser upfront. Com RSC, a maior parte poderia ser HTML puro.

### 7.2 Sem `next/image`
Nenhuma imagem no projeto usa `<Image>` do Next.js. Quando forem adicionadas as fotografias reais do laboratório e infraestrutura (requisito da Fase 2), se não usarem `next/image`, não haverá:
- Otimização automática de formato (WebP/AVIF)
- Lazy loading automático
- Placeholder blur
- Responsive sizes

### 7.3 Sem `loading.tsx`
Sem ficheiros `loading.tsx` nas rotas do portal, a navegação não tem feedback visual.

### 7.4 Sem Code Splitting nas Secções
Todas as 8 secções da landing page carregam de uma vez. Secções abaixo da dobra (Parceiros, Metodologia, CAEs, Formulário) podiam ser lazy-loaded com `dynamic()` e `Suspense`.

### 7.5 Fontes — Correto ✅
```tsx
display: 'swap' // correto em todas as fontes
```
As três fontes (Rajdhani, Exo 2, JetBrains Mono) estão corretamente configuradas com `display: 'swap'`.

### 7.6 Sem Prefetch de Rotas Críticas
Links para `/login` e `/dashboard` não têm prefetch explícito. O Next.js faz prefetch automático em links visíveis, mas não em botões que fazem scroll.

---

## 8. PROBLEMAS DE ARQUITECTURA

### 8.1 Sem Route Groups — Organização Plana
A estrutura actual mistura rotas públicas e privadas no mesmo nível:
```
app/
  page.tsx        ← pública
  login/          ← pública
  register/       ← pública
  dashboard/      ← privada (cliente)
  admin/          ← privada (admin)
```
Com Route Groups do Next.js, ficaria:
```
app/
  (public)/       ← layout público
  (auth)/         ← layout de autenticação
  (client)/       ← layout cliente
  (admin)/        ← layout admin
```

### 8.2 Autenticação Client-Side (Vulnerabilidade)
```tsx
// dashboard/layout.tsx — verificação no browser
useEffect(() => {
  const u = getUser()
  if (!u) { router.push('/login'); return }
}, [router])
```
A proteção de rotas é feita no cliente via `useEffect`. Um utilizador pode aceder a `/dashboard` e ver o HTML da página por um frame antes do redirect. A solução correta é `middleware.ts` que corre no edge antes de servir a página.

### 8.3 Sem `middleware.ts`
Não existe ficheiro de middleware para:
- Proteger rotas privadas no servidor
- Redirecionar utilizadores autenticados fora do login
- Rate limiting de rotas de API
- Internacionalização (i18n) automática

### 8.4 Dados Estáticos Misturados com Lógica de UI
O array `servicesData` (26 serviços), `partners` (20 parceiros), `provinces` (13), `serviceCbx` (10 checkboxes) está definido no topo de `page.tsx`. Deveria estar em `src/lib/data/` ou num CMS.

### 8.5 Sem Error Boundaries
Não existem ficheiros `error.tsx`. Qualquer erro de runtime faz crash silencioso.

### 8.6 Sem 404 Personalizado
Não existe `not-found.tsx`. O Next.js serve uma página de erro genérica.

### 8.7 Sem Página de Serviço Individual
Cada serviço (Infraestrutura, Segurança, Software, Web, ISP, Manutenção, Comércio) é um tab numa só página. Sem páginas individuais:
- Sem SEO específico por serviço
- Sem URL partilhável
- Sem conteúdo detalhado por serviço

### 8.8 Sem Módulo de Laboratório
O **maior diferencial da Bexaltec** (reparação de equipamentos com microscópio SMD) não tem página, módulo de gestão, ou menção destacada na homepage.

### 8.9 Sem Portfólio/Projetos
Clientes como Palácio da Justiça e Tribunal Constitucional são prova social premium. Não existe página de portfólio nem estudos de caso.

---

## 9. O QUE ESTÁ BEM (preservar)

| Aspecto | Avaliação |
|---------|-----------|
| Design tokens (cores, tipografia) | ✅ Excelente |
| Logo SVG BX com circuit-board | ✅ Profissional |
| globals.css com utility classes | ✅ Bem organizado |
| tailwind.config.ts com brand colors | ✅ Correto |
| translations.ts PT/EN completo | ✅ Extensível |
| mock-data.ts bem tipado | ✅ Supabase-ready |
| auth.ts com TODOs marcados | ✅ Preparado para migração |
| vercel.json com security headers | ✅ Boas práticas |
| next.config.js (CommonJS) | ✅ Correto para Next.js 14 |
| Fontes com display:swap | ✅ Performance correta |

---

## 10. PLANO DE EVOLUÇÃO (resumo das 3 fases)

### Fase 2 — Homepage Premium
- Reduzir landing page para 7 secções (Hero, Quem Somos, 2 Serviços Destaque, Projetos, Parceiros, CTA, Footer)
- Destacar Laboratório Especializado + Infraestrutura TI como diferenciais
- Preparar arquitetura para fotografias reais e vídeo (vturb/streaming)
- Criar páginas individuais por serviço

### Fase 3 — Arquitectura SaaS Escalável
- Route Groups: `(public)`, `(auth)`, `(client)`, `(admin)`
- `middleware.ts` para protecção de rotas no edge
- Menu hamburger com submenus por categoria
- Expandir portal do cliente: +9 módulos (orçamentos, equipamentos, estado reparação, contratos, downloads, chat, notificações)
- Expandir admin CRM: +12 módulos (laboratório, fila reparações, técnicos, agenda, peças, inventário, OS, empresas, SLA, financeiro, relatórios)
- SEO por página: metadata individual, Schema.org, breadcrumbs, sitemap dinâmico
- Performance: RSC onde possível, next/image, Suspense/loading.tsx, code splitting

---

## 11. RESUMO EXECUTIVO

| Categoria | Problemas Críticos | Problemas Moderados | Pontos Fortes |
|-----------|-------------------|--------------------|--------------:|
| Arquitectura | 4 | 5 | 3 |
| UX | 3 | 5 | 2 |
| SEO | 3 | 4 | 1 |
| Performance | 2 | 4 | 1 |
| Código | 3 | 2 | 4 |
| **Total** | **15** | **20** | **11** |

**Veredicto:** O projeto tem uma base sólida (design system, tipos, mock data) mas a landing page está sobrecarregada, a arquitectura não suporta escalabilidade, e os dois maiores diferenciais da Bexaltec (Laboratório e Infraestrutura) estão invisíveis. A evolução proposta não destrói nada — reorganiza e expande.

---

*Relatório gerado em Julho 2026 · Bexaltec Platform Audit*
