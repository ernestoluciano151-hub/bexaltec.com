# Deploy na Vercel — Bexaltec SaaS

## 1. Instalar dependências localmente (para testar)

```bash
npm install
npm run dev
# Abrir http://localhost:3000
```

## 2. Fazer push para o GitHub

Se o projeto já está num repo GitHub:
```bash
git add .
git commit -m "feat: transform to Next.js SaaS — landing + client portal + admin CRM"
git push
```

## 3. Deploy na Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar o repositório GitHub (bexaltec)
3. Vercel detecta automaticamente **Next.js**
4. Clicar **Deploy** — pronto em ~2 minutos

## 4. Configurar variáveis de ambiente na Vercel

Na Vercel: **Project Settings → Environment Variables**

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_FORMSPREE_ID` | (criar em formspree.io) |
| `NEXT_PUBLIC_SITE_URL` | https://bexaltec.ao |
| `NEXT_PUBLIC_COMPANY_EMAIL` | info@bexaltec.ao |

## 5. Credenciais de demo

| Acesso | Email | Senha |
|---|---|---|
| Cliente Demo | joao@sonaref.ao | demo123 |
| Admin Demo | admin@bexaltec.ao | admin123 |
| Botão "Demo" | (sem senha) | (login direto) |

## 6. Próximas melhorias (roadmap)

### Integração Supabase (auth real)
1. Criar projeto em [supabase.com](https://supabase.com) (gratuito)
2. Copiar URL e ANON KEY para `.env.local`
3. Substituir funções em `src/lib/auth.ts` por chamadas Supabase

### Integração Formspree (formulário real)
1. Criar conta em [formspree.io](https://formspree.io)
2. Criar novo form → copiar o ID
3. Definir `NEXT_PUBLIC_FORMSPREE_ID` e substituir a linha `TODO` em `src/app/page.tsx`

### Domínio personalizado
1. Na Vercel: **Project Settings → Domains**
2. Adicionar `bexaltec.ao` ou `www.bexaltec.ao`
3. Configurar DNS no registo do domínio .ao

### Funcionalidades futuras
- [ ] Notificações por email (SendGrid/Resend)
- [ ] Upload de ficheiros nos tickets
- [ ] Relatórios PDF (puppeteer)
- [ ] Dashboard de análises (Vercel Analytics)
- [ ] App mobile (React Native / Expo)
- [ ] Integração Multicaixa para pagamentos
