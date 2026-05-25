import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'A small Bangkok perfume studio. Composed, macerated, aged, bottled by hand on Sukhumvit.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
