/**
 * Mirrors `back-end/supabase/migrations/*.sql`.
 *
 * Hand-maintained for now, in the shape postgrest-js expects (`Row` / `Insert` /
 * `Update` / `Relationships` per table) — the `Relationships` entries are what
 * let embedded selects like `products(*, product_sizes(*))` type-check.
 *
 * Once the Supabase project exists you can regenerate this file instead:
 *   npx supabase gen types typescript --project-id <ref> > packages/shared/src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

type ProductRow = {
  id: string
  name: string
  number: string
  tagline_en: string
  tagline_th: string
  family_en: string
  family_th: string
  story_en: string
  story_th: string
  notes_top: string[]
  notes_heart: string[]
  notes_base: string[]
  status: string
  hue: string
  image_url: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type ProductSizeRow = {
  id: string
  product_id: string
  ml: number
  price: number
  sort_order: number
}

type JournalRow = {
  id: string
  slug: string
  number: string
  date: string
  title_en: string
  title_th: string
  excerpt_en: string
  excerpt_th: string
  body_en: string
  body_th: string
  body2_en: string | null
  body2_th: string | null
  readtime: string
  published: boolean
  created_at: string
  updated_at: string
}

type ProfileRow = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  preferred_lang: string
  is_invited: boolean
  role: string
  created_at: string
  updated_at: string
}

type OrderRow = {
  id: string
  user_id: string | null
  email: string
  status: string
  stripe_session_id: string | null
  stripe_payment_id: string | null
  payment_method: string | null
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  carrier: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
}

type OrderItemRow = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  size_ml: number
  qty: number
  unit_price: number
  created_at: string
}

type ShippingAddressRow = {
  id: string
  order_id: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
  created_at: string
}

type WishlistRow = {
  user_id: string
  product_id: string
  created_at: string
}

type NewsletterRow = {
  email: string
  lang: string
  subscribed_at: string
  active: boolean
}

/** Every column optional except the ones named in K. */
type Insert<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Insert<ProfileRow, 'id'>
        Update: Partial<ProfileRow>
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: ProductRow
        Insert: Insert<ProductRow, 'id' | 'name'>
        Update: Partial<ProductRow>
        Relationships: []
      }
      product_sizes: {
        Row: ProductSizeRow
        Insert: Insert<ProductSizeRow, 'product_id' | 'ml' | 'price'>
        Update: Partial<ProductSizeRow>
        Relationships: [
          {
            foreignKeyName: 'product_sizes_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      journal_entries: {
        Row: JournalRow
        Insert: Insert<JournalRow, 'id' | 'slug' | 'date'>
        Update: Partial<JournalRow>
        Relationships: []
      }
      orders: {
        Row: OrderRow
        Insert: Insert<OrderRow, 'id' | 'email' | 'subtotal' | 'total'>
        Update: Partial<OrderRow>
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: OrderItemRow
        Insert: Insert<
          OrderItemRow,
          'order_id' | 'product_id' | 'product_name' | 'size_ml' | 'qty' | 'unit_price'
        >
        Update: Partial<OrderItemRow>
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      shipping_addresses: {
        Row: ShippingAddressRow
        Insert: Insert<
          ShippingAddressRow,
          'order_id' | 'first_name' | 'last_name' | 'phone' | 'address' | 'city' | 'postcode'
        >
        Update: Partial<ShippingAddressRow>
        Relationships: [
          {
            foreignKeyName: 'shipping_addresses_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
        ]
      }
      wishlists: {
        Row: WishlistRow
        Insert: Insert<WishlistRow, 'user_id' | 'product_id'>
        Update: Partial<WishlistRow>
        Relationships: [
          {
            foreignKeyName: 'wishlists_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      newsletter_subscribers: {
        Row: NewsletterRow
        Insert: Insert<NewsletterRow, 'email'>
        Update: Partial<NewsletterRow>
        Relationships: []
      }
    }
    Views: {
      member_tiers: {
        Row: {
          user_id: string | null
          is_invited: boolean | null
          completed_orders: number | null
          tier: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
