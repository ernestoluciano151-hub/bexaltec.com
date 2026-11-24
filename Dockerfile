# ─── Bexaltec · imagem da aplicação (Next.js standalone) ────────────────────
# Três etapas: dependências → compilação → execução. A imagem final só leva o
# servidor Node mínimo gerado pelo Next.js, os estáticos e public/.

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Valores fictícios só para a compilação: db.ts e jwt-config.ts exigem-nos ao
# carregar, mas nenhuma página consulta a base durante o build. Não passam
# para a imagem final — os verdadeiros vêm do .env do servidor.
RUN DATABASE_URL=postgres://build:build@127.0.0.1:1/build \
    JWT_SECRET=build-only-placeholder-never-used-at-runtime-0000 \
    npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
CMD ["node", "server.js"]
