import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
}

export function MonoTag({ children, className }: Props) {
  return <span className={cn('ordi-mono-tag', className)}>{children}</span>
}
