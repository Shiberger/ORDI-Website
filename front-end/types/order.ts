export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type Carrier = 'thai-post' | 'kerry' | 'pickup'

export type PaymentMethod = 'card' | 'promptpay' | 'transfer'

export type CartItem = {
  id: string
  size: number
  qty: number
}

export type ShippingAddress = {
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
}

export type OrderItem = {
  product_id: string
  product_name: string
  size_ml: number
  qty: number
  unit_price: number
}

export type Order = {
  id: string
  user_id: string | null
  email: string
  status: OrderStatus
  stripe_session_id: string | null
  stripe_payment_id: string | null
  payment_method: PaymentMethod | null
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  carrier: Carrier | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
}
