import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes from the studio. Slowly, about smelling.',
}

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children
}
