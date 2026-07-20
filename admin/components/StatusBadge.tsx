import { ORDER_STATUS_LABELS, type OrderStatus } from '@ordi/shared'

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge badge--${status}`}>{ORDER_STATUS_LABELS[status]}</span>
}
