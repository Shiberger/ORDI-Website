'use server'

import { revalidatePath } from 'next/cache'
import {
  ORDER_STATUSES,
  updateOrder,
  type Carrier,
  type OrderStatus,
} from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true } | { ok: false; error: string }

const CARRIERS: readonly Carrier[] = ['thai-post', 'kerry', 'pickup']

export async function updateOrderAction(
  orderId: string,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin()

  const status = String(formData.get('status') ?? '')
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { ok: false, error: `Unknown status "${status}".` }
  }

  const carrierRaw = String(formData.get('carrier') ?? '')
  const carrier = CARRIERS.includes(carrierRaw as Carrier)
    ? (carrierRaw as Carrier)
    : null

  const tracking = String(formData.get('tracking_number') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()

  try {
    const db = await createClient()
    await updateOrder(db, orderId, {
      status: status as OrderStatus,
      carrier,
      tracking_number: tracking || null,
      notes: notes || null,
    })
  } catch (err) {
    console.error('[orders] update failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Update failed.' }
  }

  revalidatePath('/orders')
  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/')
  return { ok: true }
}
