import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="login">
      <div className="login__card">
        <p className="login__brand">404</p>
        <p className="login__sub">Nothing here</p>
        <Link href="/" className="btn btn--primary" style={{ width: '100%' }}>
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
