import { requireAdmin } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { SetupNotice } from '@/components/SetupNotice'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware can't redirect to /login without Supabase, so this is the first
  // place a fresh clone would otherwise blow up.
  if (!isSupabaseConfigured()) return <SetupNotice />

  const session = await requireAdmin()
  const supabase = await createClient()

  // Drives the "needs attention" badge next to Orders.
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['paid', 'processing'])

  return (
    <div className="shell">
      <Sidebar email={session.email} role={session.role} pendingOrders={count ?? 0} />
      <main className="main">{children}</main>
    </div>
  )
}
