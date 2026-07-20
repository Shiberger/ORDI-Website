import type { StaticImageData } from 'next/image'
import type { Product } from '@/types/product'
import GoodBoy from '@/assets/products/good_boy_1.jpg'
import HotDilf from '@/assets/products/hot_dilf_1.jpg'
import SeaBreeze from '@/assets/products/sea_breeze_1.jpg'
import DrowningLove from '@/assets/products/drowning_love_1.jpg'

/**
 * Studio photography that ships with the bundle. Products created in the admin
 * dashboard have no bundled art, so they carry an `image_url` instead.
 */
export const productImages: Record<string, StaticImageData> = {
  'good-boy': GoodBoy,
  'hot-dilf': HotDilf,
  'sea-breeze': SeaBreeze,
  'drowning-love': DrowningLove,
}

type ImageSource = StaticImageData | string | undefined

/** `image_url` wins; bundled art is the fallback; undefined renders the placeholder. */
export function getProductImage(
  product: Pick<Product, 'id' | 'image_url'> | string
): ImageSource {
  if (typeof product === 'string') return productImages[product]
  return product.image_url ?? productImages[product.id]
}
