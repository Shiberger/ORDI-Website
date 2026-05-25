import { cn } from '@/lib/utils'

type Props = {
  placeholder: string
  shape?: 'rect' | 'rounded' | 'circle' | 'pill'
  className?: string
}

export function BottleSlot({ placeholder, shape = 'rect', className }: Props) {
  return (
    <div
      className={cn('ordi-slot', `ordi-slot--${shape}`, className)}
      role="img"
      aria-label={placeholder}
    >
      <div className="ordi-slot__inner">
        <span className="ordi-slot__placeholder">{placeholder}</span>
      </div>
    </div>
  )
}
