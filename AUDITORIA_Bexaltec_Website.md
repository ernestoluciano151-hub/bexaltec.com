# Auditoria — Bexaltec Website
**Data:** 23 de Julho de 2026  
**Ficheiro analisado:** `Bexaltec_Website_Completo.html`  
**Stack atual:** HTML único · CSS inline · JavaScript vanilla

---

## Resumo Executivo

O site está bem desenhado visualmente, com uma identidade coerente e boa estrutura de secções. No entanto, existem **problemas críticos** que impedem o site de funcionar corretamente em produção — nomeadamente o formulário que não envia dados para lado nenhum e informações de contacto em placeholder. Abaixo estão todos os achados, organizados por prioridade.

---

## 🔴 Crítico — Resolver Antes do Deploy

### 1. Formulário de orçamento é falso
**Ficheiro:** `<script>` → função `submitQ()`  
O botão "Enviar Pedido de Orçamento" nunca envia nada. A função apenas esconde o form e mostra uma mensagem de sucesso com uma referência aleatória. Nenhum email chega à empresa.

**Solução recomendada:** Integrar [Formspree](https://formspree.io) (gratuito, sem backend) ou [EmailJS](https://emailjs.com). Basta mudar o `action` do form.

---

### 2. Número de telefone é placeholder
**Linha:** secção `#contacto` e `#orcamento`  
```
+244 XXX XXX XXX
```
Qualquer visitante que tente ligar verá um número inválido. Substituir pelo número real da empresa.

---

### 3. Copyright desatualizado
**Linha:** `<footer>`  
```
© 2025 Bexaltec.
```
O ano corrente é 2026. Atualizar para `© 2026` ou tornar dinâmico com JS:
```js
document.querySelector('.fcopy').textContent = `© ${new Date().getFullYear()} Bexaltec. ...`
```

---

## 🟡 Importante — Melhorar a Curto Prazo

### 4. SEO completamente em falta
Só existem 2 meta tags (`charset` e `viewport`). Faltam:
- `<meta name="description" content="...">` — usado pelo Google no resultado de pesquisa
- `<meta property="og:title">` / `og:description` / `og:image` — partilha em redes sociais
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://bexaltec.ao/">`

**Impacto:** Sem estas tags, o site não aparece bem no Google nem quando partilhado no WhatsApp/LinkedIn.

---

### 5. Sem favicon
Não existe nenhum ícone de aba (`<link rel="icon">`). O browser mostra um ícone genérico.

---

### 6. Inconsistência de idioma no título
```html
<title>Bexaltec – Soluciones Informáticas</title>
```
"Soluciones Informáticas" é **espanhol**. O resto do site está em português. Corrigir para "Soluções Informáticas" ou "Soluções de TI".

---

### 7. Menu de navegação não tem hamburger para mobile
Em ecrãs pequenos (telemóvel), os links do `nav` transbordam e ficam invisíveis ou comprimidos. Não existe menu hamburger (≡) nem versão mobile do menu.

**Impacto:** A maioria dos utilizadores angolanos acede via telemóvel. Esta é uma falha de usabilidade significativa.

---

### 8. Sem `robots.txt` nem `sitemap.xml`
Para indexação correta no Google é necessário um `sitemap.xml` com todas as páginas e um `robots.txt`.

---

## 🟢 Bom — Manter e Expandir

| ✅ Ponto positivo | Detalhe |
|---|---|
| Design limpo e profissional | Identidade visual coerente com a marca |
| CSS com variáveis `:root` | Fácil de mudar cores globalmente |
| Animação de scroll no nav | Destaca a secção ativa corretamente |
| Tabs de serviços funcionais | Boa UX para categorizar os serviços |
| Layout responsivo base | Usa `grid` com `auto-fit` e `clamp()` |
| Scroll suave | `scroll-behavior: smooth` ativo |
| Ficheiro único | Fácil de hospedar |

---

## 📋 Plano de Ação Priorizado

| # | Tarefa | Prioridade | Esforço |
|---|---|---|---|
| 1 | Integrar Formspree no formulário | 🔴 Crítico | 30 min |
| 2 | Substituir número placeholder pelo real | 🔴 Crítico | 5 min |
| 3 | Atualizar copyright para 2026 | 🔴 Crítico | 2 min |
| 4 | Adicionar meta tags SEO completas | 🟡 Importante | 20 min |
| 5 | Adicionar favicon | 🟡 Importante | 10 min |
| 6 | Corrigir "Soluciones" → "Soluções" | 🟡 Importante | 2 min |
| 7 | Criar menu hamburger mobile | 🟡 Importante | 1–2h |
| 8 | Criar `robots.txt` e `sitemap.xml` | 🟡 Importante | 15 min |
| 9 | Google Analytics / Hotjar | 🟢 Futuro | 30 min |
| 10 | Adicionar logo/imagem real | 🟢 Futuro | variável |

---

## 🚀 Deploy na Vercel

O site pode ser colocado na Vercel **sem alterar o código** — é um HTML estático. Passos:

### Opção A — GitHub (recomendada)
1. No repositório GitHub, o ficheiro deve chamar-se `index.html` (renomear `Bexaltec_Website_Completo.html`)
2. Em [vercel.com](https://vercel.com), clicar **"Add New Project"**
3. Importar o repositório GitHub
4. Vercel deteta automaticamente que é um site estático
5. Clicar **Deploy** — fica online em ~1 minuto

### Opção B — Drag & Drop
1. Aceder a [vercel.com/new](https://vercel.com/new)
2. Arrastar a pasta com o `index.html` para a área de upload
3. Deploy imediato

### Ficheiros sugeridos para o repositório
```
/
├── index.html          ← (renomear o ficheiro atual)
├── robots.txt          ← (criar)
├── sitemap.xml         ← (criar)
└── vercel.json         ← (opcional, para headers de cache/segurança)
```

### `vercel.json` recomendado
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

*Auditoria gerada por Claude · Cowork · Julho 2026*
