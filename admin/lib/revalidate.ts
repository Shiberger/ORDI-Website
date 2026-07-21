import 'server-only'

/**
 * Ask the storefront to rebuild the pages a content edit touched.
 *
 * Deliberately non-fatal: the row is already saved, and the storefront
 * revalidates hourly on its own. A failure here is a staleness bug, not a
 * data-loss one, so it must never turn a successful save into an error.
 */
export async function revalidateStorefront(paths: string[]): Promise<void> {
  const siteUrl = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!siteUrl || !secret) {
    console.warn('[revalidate] STOREFRONT_URL / REVALIDATE_SECRET not set — skipping')
    return
  }

  try {
    const res = await fetch(`${siteUrl.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ paths }),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('[revalidate] storefront responded', res.status, await res.text())
    }
  } catch (err) {
    console.error('[revalidate] request failed', err)
  }
}
