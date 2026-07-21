import type { NextConfig } from 'next'

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const config: NextConfig = {
  reactStrictMode: true,
  // @ordi/shared ships raw TypeScript — Next compiles it as part of the app.
  transpilePackages: ['@ordi/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Product art uploaded through the admin dashboard (Supabase Storage).
      ...(supabaseHost
        ? [{ protocol: 'https' as const, hostname: supabaseHost }]
        : []),
    ],
  },
  typedRoutes: false,
}

export default config
