// ─── Configuração da chave JWT ────────────────────────────────────────────
// Módulo isolado (sem dependências de Node) para poder ser importado tanto
// pelo middleware (edge runtime) como pelo código de servidor.
//
// NÃO existe valor por omissão: sem JWT_SECRET a aplicação não arranca.
// Uma chave por omissão no código permitiria a qualquer pessoa com acesso ao
// repositório forjar um token com role "admin".

const secret = process.env.JWT_SECRET

if (!secret || secret.length < 32) {
  throw new Error(
    'JWT_SECRET não está definido ou tem menos de 32 caracteres. ' +
    'Gere uma chave com "openssl rand -base64 32" e defina-a em .env.local ' +
    'e em Vercel → Settings → Environment Variables.'
  )
}

export const JWT_SECRET = new TextEncoder().encode(secret)
export const JWT_ALGORITHM = 'HS256'
/** Duração da sessão, em segundos (7 dias). */
export const SESSION_DURATION = 60 * 60 * 24 * 7
