import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  placeholder: string
  shape?: 'rect' | 'rounded' | 'circle' | 'pill'
  className?: string
  image?: StaticImageData | string
  alt?: string
  objectPosition?: string
  sizes?: string
  quality?: number
  priority?: boolean
}

export function BottleSlot({
  placeholder,
  shape = 'rect',
  className,
  image,
  alt,
  objectPosition,
  sizes = '(max-width: 768px) 100vw, 600px',
  quality,
  priority,
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
          sizes={sizes}
          quality={quality}
          priority={priority}
          // Bundled art carries a build-time blurDataURL; uploaded art is a bare
          // URL, so it fades in over the slot background instead.
          placeholder={typeof image === 'object' ? 'blur' : undefined}
        />
      ) : (
        <div className="ordi-slot__inner">
          <span className="ordi-slot__placeholder">{placeholder}</span>
        </div>
      )}
    </div>
  )
}
