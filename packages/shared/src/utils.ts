import type { OrderStatus } from './types/order'

export function formatPrice(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatTHB(n: number): string {
  return `฿${formatPrice(n)}`
}

/** Bottle hues dark enough that overlaid text must flip to paper. */
export function isDarkHue(hue: string): boolean {
  const normalized = hue.trim().toUpperCase()
  return normalized === '#1A1612' || normalized === '#2A1A24'
}

const ORDER_ID_ALPHABET = '0123456789'

/**
 * Human-readable, sequential-looking order id (e.g. `ORDI-48201`).
 * Collisions are caught by the primary-key constraint at insert time.
 */
export function generateOrderId(): string {
  let digits = ''
  for (let i = 0; i < 5; i++) {
    digits += ORDER_ID_ALPHABET[Math.floor(Math.random() * ORDER_ID_ALPHABET.length)]
  }
  return `ORDI-${digits}`
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending payment',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  })
}

/** Turn a title into a URL-safe slug, preserving Thai characters. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9฀-๿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
