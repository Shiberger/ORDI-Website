import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  placeholder: string
  shape?: 'rect' | 'rounded' | 'circle' | 'pill'
  className?: string
  image?: StaticImageData | string
  alt?: string
  objectPosition?: string
}

export function BottleSlot({
  placeholder,
  shape = 'rect',
  className,
  image,
  alt,
  objectPosition,
}: Props) {
  return (
    <div
      className={cn('ordi-slot', `ordi-slot--${shape}`, className)}
      role="img"
      aria-label={alt ?? placeholder}
    >
      {image ? (
        <Image
          src={image}
          alt={alt ?? placeholder}
          fill
          className="ordi-slot__image"
          style={objectPosition ? { objectPosition } : undefined}
          sizes="(max-width: 768px) 100vw, 600px"
        />
      ) : (
        <div className="ordi-slot__inner">
          <span className="ordi-slot__placeholder">{placeholder}</span>
        </div>
      )}
    </div>
  )
}
