'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/context/AppContext'

/**
 * Emptied only once the shopper actually lands on the success page — an
 * abandoned Stripe session must leave the cart intact.
 */
export function ClearCartOnMount() {
  const { clearCart } = useApp()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
