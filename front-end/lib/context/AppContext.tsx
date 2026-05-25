'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { products } from '@/lib/data/products'
import { uiStrings, type UIStrings } from '@/lib/data/ui-strings'
import type { Lang } from '@/types/product'
import type { CartItem } from '@/types/order'

const CART_KEY = 'ordi.cart.v1'
const WISHLIST_KEY = 'ordi.wishlist.v1'
const LANG_KEY = 'ordi.lang.v1'

type AppContextValue = {
  cart: CartItem[]
  addToCart: (id: string, size: number) => void
  setQty: (id: string, size: number, qty: number) => void
  removeFromCart: (id: string, size: number) => void
  cartCount: number
  subtotal: number

  wishlist: string[]
  toggleWishlist: (id: string) => void

  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  lang: Lang
  setLang: (lang: Lang) => void
  t: UIStrings
}

const AppContext = createContext<AppContextValue | null>(null)

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / serialization errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lang, setLangState] = useState<Lang>('en')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCart(readStorage<CartItem[]>(CART_KEY, []))
    setWishlist(readStorage<string[]>(WISHLIST_KEY, []))
    setLangState(readStorage<Lang>(LANG_KEY, 'en'))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) writeStorage(CART_KEY, cart)
  }, [cart, hydrated])

  useEffect(() => {
    if (hydrated) writeStorage(WISHLIST_KEY, wishlist)
  }, [wishlist, hydrated])

  useEffect(() => {
    if (hydrated) writeStorage(LANG_KEY, lang)
  }, [lang, hydrated])

  const addToCart = useCallback((id: string, size: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === id && it.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { id, size, qty: 1 }]
    })
    setDrawerOpen(true)
  }, [])

  const setQty = useCallback((id: string, size: number, qty: number) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === id && it.size === size ? { ...it, qty } : it))
        .filter((it) => it.qty > 0)
    )
  }, [])

  const removeFromCart = useCallback((id: string, size: number) => {
    setCart((prev) => prev.filter((it) => !(it.id === id && it.size === size)))
  }, [])

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
  }, [])

  const cartCount = useMemo(() => cart.reduce((n, it) => n + it.qty, 0), [cart])

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, it) => {
        const p = products.find((x) => x.id === it.id)
        if (!p) return sum
        const s = p.sizes.find((x) => x.ml === it.size)
        return sum + (s ? s.price * it.qty : 0)
      }, 0),
    [cart]
  )

  const t = uiStrings[lang]

  const value: AppContextValue = {
    cart,
    addToCart,
    setQty,
    removeFromCart,
    cartCount,
    subtotal,
    wishlist,
    toggleWishlist,
    drawerOpen,
    setDrawerOpen,
    lang,
    setLang,
    t,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
