import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { AppProvider } from '@/lib/context/AppContext'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ORDI — Out of Ordinary Only Ous',
    template: '%s — ORDI',
  },
  description:
    'A small Bangkok perfume studio. Five hand-bottled fragrances. Eau de Parfum, 18%.',
  openGraph: {
    title: 'ORDI — Out of Ordinary Only Ous',
    description:
      'A small Bangkok perfume studio. Five hand-bottled fragrances. Eau de Parfum, 18%.',
    type: 'website',
    url: SITE_URL,
    siteName: 'ORDI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORDI — Out of Ordinary Only Ous',
    description:
      'A small Bangkok perfume studio. Five hand-bottled fragrances. Eau de Parfum, 18%.',
  },
}

export const viewport: Viewport = {
  width: 1280,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901&display=swap"
        />
      </head>
      <body>
        <AppProvider>
          <Nav />
          {children}
          <Footer />
          <CartDrawer />
        </AppProvider>
      </body>
    </html>
  )
}
