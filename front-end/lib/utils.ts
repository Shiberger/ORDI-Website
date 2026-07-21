import { clsx, type ClassValue } from 'clsx'

export function cn(...args: ClassValue[]): string {
  return clsx(args)
}

export function formatPrice(n: number): string {
  return n.toLocaleString('en-US')
}

/**
 * Whether overlay labels on a bottle backdrop need to flip to paper.
 * Measured rather than listed: hues are typed into the admin dashboard, so any
 * hard-coded set goes stale the first time someone adds a fragrance.
 */
export function isDarkHue(hue: string): boolean {
  const hex = hue.trim().replace('#', '')
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex
  if (!/^[0-9a-f]{6}$/i.test(full)) return false

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
  // Relative luminance (WCAG); 0.4 sits well clear of every hue in the catalogue.
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) < 0.4
}
