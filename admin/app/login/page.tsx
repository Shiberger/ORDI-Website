import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/LoginForm'
import { SetupNotice } from '@/components/SetupNotice'
import { isSupabaseConfigured } from '@/lib/env'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />

  return (
    <main className="login">
      <div className="login__card">
        <p className="login__brand">ORDI</p>
        <p className="login__sub">Studio dashboard</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
