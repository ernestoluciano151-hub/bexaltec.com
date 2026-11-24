// ─── PostgreSQL + Drizzle ORM ────────────────────────────────────────────────
// Ligação TCP normal (postgres-js) ao PostgreSQL do servidor — em produção, o
// contentor "db" do docker-compose; localmente, o que estiver em DATABASE_URL.
//
// A ligação só abre na primeira consulta, por isso `next build` não precisa de
// base de dados. Em desenvolvimento, o cliente fica em globalThis para que o
// hot reload não abra uma ligação nova a cada alteração de ficheiro.

import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to .env.local (desenvolvimento) ou .env (servidor).')
}

const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> }

const client =
  globalForDb.pgClient ??
  postgres(process.env.DATABASE_URL, {
    max: Number(process.env.DB_POOL_MAX ?? 10), // ligações em simultâneo
    idle_timeout: 30,                            // fecha ligações paradas (s)
    connect_timeout: 10,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.pgClient = client

export const db = drizzle(client, { schema })

export type DB = typeof db
