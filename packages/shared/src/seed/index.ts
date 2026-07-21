/**
 * The original hand-written catalogue, kept as a single source of seed data.
 *
 * Two consumers:
 *  1. `back-end/scripts/seed.ts` — pushes these rows into Supabase once.
 *  2. The storefront — falls back to them when Supabase env vars are absent,
 *     so `npm run build` and local dev still work before the project is set up.
 *
 * Once seeded, Supabase is the source of truth and the admin dashboard owns
 * these records. Editing the files below no longer changes the live site.
 */
export { seedProducts } from './products'
export { seedJournal } from './journal'
