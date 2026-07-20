import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Called by the admin dashboard after a product or journal entry is saved, so
 * the statically generated storefront picks the change up immediately instead
 * of waiting out the hourly `revalidate`.
 *
 *   POST /api/revalidate
 *   Authorization: Bearer $REVALIDATE_SECRET
 *   { "paths": ["/shop", "/shop/good-boy"] }
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'REVALIDATE_SECRET is not set' }, { status: 503 })
  }

  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let paths: string[]
  try {
    const body = (await request.json()) as { paths?: unknown }
    paths = Array.isArray(body.paths)
      ? body.paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'))
      : []
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (paths.length === 0) {
    return NextResponse.json({ error: 'No valid paths supplied' }, { status: 400 })
  }

  for (const path of paths) revalidatePath(path)

  return NextResponse.json({ revalidated: paths })
}
