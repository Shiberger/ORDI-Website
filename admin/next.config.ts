import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ordi/shared'],
  typedRoutes: false,
}

export default config
