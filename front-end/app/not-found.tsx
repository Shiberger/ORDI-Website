import Link from 'next/link'
import { MonoTag } from '@/components/ui/MonoTag'

export default function NotFound() {
  return (
    <main className="ordi-section" style={{ minHeight: '60vh' }}>
      <MonoTag>ERROR · 404</MonoTag>
      <h1 className="ordi-display-xl" style={{ marginTop: 24 }}>
        Not <em>found</em>.
      </h1>
      <p style={{ marginTop: 16, maxWidth: 520 }}>
        This page has wandered off. Perhaps the bottle is in another studio.
      </p>
      <Link href="/" className="ordi-btn ordi-btn--ghost" style={{ marginTop: 32 }}>
        ← Back to ORDI
      </Link>
    </main>
  )
}
