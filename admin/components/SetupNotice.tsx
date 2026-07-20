/**
 * Shown instead of a stack trace when the app is run before a Supabase project
 * exists — the state a fresh clone is in.
 */
export function SetupNotice() {
  return (
    <main className="login">
      <div className="login__card">
        <p className="login__brand">ORDI</p>
        <p className="login__sub">Not configured yet</p>

        <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>
          This dashboard needs a Supabase project. Create one, run the migrations
          in <code>back-end/supabase/migrations/</code>, then:
        </p>

        <pre
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            lineHeight: 1.8,
            background: 'var(--paper)',
            border: '1px solid var(--line-strong)',
            padding: '12px 14px',
            overflowX: 'auto',
          }}
        >
          {`cp admin/.env.example admin/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL + ANON_KEY

npm run seed
npm run make-admin -- you@email.com`}
        </pre>

        <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 0 }}>
          Full walkthrough: <strong>Project-dev.md → Setup Runbook</strong>
        </p>
      </div>
    </main>
  )
}
