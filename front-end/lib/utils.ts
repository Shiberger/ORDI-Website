import { clsx, type ClassValue } from 'clsx'

export function cn(...args: ClassValue[]): string {
  return clsx(args)
}

export function formatPrice(n: number): string {
  return n.toLocaleString('en-US')
}

export function isDarkHue(hue: string): boolean {
  return hue === '#1A1612' || hue === '#2A1A24'
}
