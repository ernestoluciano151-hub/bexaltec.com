import type { Metadata } from 'next'
import { Rajdhani, Exo_2, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-exo',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bexaltec — Soluções Informáticas · Luanda, Angola',
  description: 'Empresa angolana especializada em infraestrutura TI, segurança eletrónica, desenvolvimento de software e transformação digital. Luanda, Angola.',
  keywords: ['TI Angola', 'informática Luanda', 'redes Angola', 'segurança eletrónica', 'software Angola', 'Bexaltec'],
  authors: [{ name: 'Bexaltec', url: 'https://bexaltec.ao' }],
  openGraph: {
    title: 'Bexaltec — Soluções Informáticas · Angola',
    description: 'Soluções tecnológicas completas adaptadas à realidade angolana. Infraestrutura TI, segurança eletrónica, software e web.',
    url: 'https://bexaltec.ao',
    siteName: 'Bexaltec',
    locale: 'pt_AO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bexaltec — Soluções Informáticas · Angola',
    description: 'Soluções tecnológicas completas para empresas angolanas.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${rajdhani.variable} ${exo2.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
