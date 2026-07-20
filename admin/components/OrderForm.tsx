'use client'

import { useState, useTransition } from 'react'
import { ORDER_STATUSES, type OrderDetail } from '@ordi/shared'
import { updateOrderAction } from '@/lib/actions/orders'

const CARRIERS = [
  { id: '', label: 'Not set' },
  { id: 'thai-post', label: 'Thai Post' },
  { id: 'kerry', label: 'Kerry Express' },
  { id: 'pickup', label: 'Studio pickup' },
]

export function OrderForm({ order }: { order: OrderDetail }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateOrderAction(order.id, formData)
      setMessage(
        result.ok
          ? { ok: true, text: 'Order updated.' }
          : { ok: false, text: result.error }
      )
    })
  }

  return (
    <form action={onSubmit}>
      {message && (
        <p className={message.ok ? 'alert alert--ok' : 'alert'}>{message.text}</p>
      )}

      <label className="field">
        <span>Status</span>
        <select name="status" defaultValue={order.status}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <small>
          Moving to paid / shipped / delivered stamps the matching timestamp.
        </small>
      </label>

      <label className="field">
        <span>Carrier</span>
        <select name="carrier" defaultValue={order.carrier ?? ''}>
          {CARRIERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Tracking number</span>
        <input name="tracking_number" defaultValue={order.tracking_number ?? ''} />
      </label>

      <label className="field">
        <span>Internal note</span>
        <textarea name="notes" defaultValue={order.notes ?? ''} rows={3} />
      </label>

      <button className="btn btn--primary" disabled={pending}>
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
