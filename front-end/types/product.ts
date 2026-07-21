// Domain types live in @ordi/shared so the storefront and the admin dashboard
// can never drift apart. Re-exported here to keep existing `@/types/*` imports.
export type {
  Lang,
  Bilingual,
  ProductStatus,
  ProductSize,
  ProductNotes,
  Product,
  AdminProduct,
  JournalEntry,
  AdminJournalEntry,
} from '@ordi/shared'
