// ─── Neon PostgreSQL + Drizzle ORM connection ────────────────────────────────
// Serverless-compatible: uses HTTP driver for edge/serverless environments.
// DATABASE_URL must be set in .env.local and Vercel Environment Variables.

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to .env.local and Vercel env vars.')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })

export type DB = typeof db
