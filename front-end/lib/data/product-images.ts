import type { StaticImageData } from 'next/image'
import type { Product } from '@/types/product'
import GoodBoy from '@/assets/products/good_boy_1.webp'
import HotDilf from '@/assets/products/hot_dilf_1.webp'
import SeaBreeze from '@/assets/products/sea_breeze_1.webp'
import DrowningLove from '@/assets/products/drowning_love_1.webp'
import CloudFon50 from '@/assets/products/cloudfon/cloudfon_50ml.webp'
import CloudFon12 from '@/assets/products/cloudfon/cloudfon_12ml.webp'
import CloudFonDuo from '@/assets/products/cloudfon/cloudfon_duo.webp'
import CloudFonNotes from '@/assets/products/cloudfon/cloudfon_note_perfume.webp'
import CloudFonAvailable from '@/assets/products/cloudfon/cloudfon_available.webp'

/**
 * Studio photography that ships with the bundle. Products created in the admin
 * dashboard have no bundled art, so they carry an `image_url` instead.
 */
export const productImages: Record<string, StaticImageData> = {
  'good-boy': GoodBoy,
  'hot-dilf': HotDilf,
  'sea-breeze': SeaBreeze,
  'drowning-love': DrowningLove,
  'cloud-fon': CloudFon50,
}

export type GalleryPlate = {
  image: StaticImageData
  /** Alt text per language — these stills carry baked-in copy worth describing. */
  alt: { en: string; th: string }
}

/**
 * Extra stills shown under the hero on a product page. Only shoots that have
 * more than one frame appear here; everything else renders without a gallery.
 */
export const productGallery: Record<string, GalleryPlate[]> = {
  'cloud-fon': [
    {
      image: CloudFonDuo,
      alt: {
        en: 'CLOUD FON 12ml and 50ml bottles together on wet moss',
        th: 'เคล้าฝน ขวด 12 และ 50 มิลลิลิตร วางคู่กันบนมอสเปียก',
      },
    },
    {
      image: CloudFon12,
      alt: {
        en: 'CLOUD FON 12ml roll-on beside a white magnolia',
        th: 'เคล้าฝน ขนาด 12 มิลลิลิตร ข้างดอกแมกโนเลียสีขาว',
      },
    },
    {
      image: CloudFonNotes,
      alt: {
        en: 'Rain, Magnolia, Skin — the three notes over wet foliage',
        th: 'Rain, Magnolia, Skin — สามโน้ตหลักบนพื้นใบไม้เปียกฝน',
      },
    },
    {
      image: CloudFonAvailable,
      alt: {
        en: 'CLOUD FON — now available',
        th: 'เคล้าฝน — วางจำหน่ายแล้ว',
      },
    },
  ],
}

type ImageSource = StaticImageData | string | undefined

/** `image_url` wins; bundled art is the fallback; undefined renders the placeholder. */
export function getProductImage(
  product: Pick<Product, 'id' | 'image_url'> | string
): ImageSource {
  if (typeof product === 'string') return productImages[product]
  return product.image_url ?? productImages[product.id]
}

/** Empty for every product that only has the one hero frame. */
export function getProductGallery(productId: string): GalleryPlate[] {
  return productGallery[productId] ?? []
}
