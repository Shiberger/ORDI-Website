import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Three tiers. No points. No discounts. Just better fragrance for repeat customers.',
}

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children
}
