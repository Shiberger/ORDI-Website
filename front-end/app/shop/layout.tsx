import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Five fragrances. Hand-bottled in Bangkok. Eau de Parfum, 18%.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
