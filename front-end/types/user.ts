import type { Lang } from './product'

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  preferred_lang: Lang
  is_invited: boolean
  created_at: string
  updated_at: string
}

export type MemberTier = 'ordinary' | 'ous' | 'out_of_ordinary'
