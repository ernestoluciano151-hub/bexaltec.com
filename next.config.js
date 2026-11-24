/** @type {import('next').NextConfig} */

// Cabeçalhos de segurança — antes no vercel.json, agora servidos pela própria
// aplicação (valem em qualquer alojamento).
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options',        value: 'DENY' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
  // Só HTTPS durante 1 ano. O Caddy/Cloudflare servem sempre HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const nextConfig = {
  reactStrictMode: true,
  // Gera .next/standalone: servidor Node mínimo para a imagem Docker.
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig
