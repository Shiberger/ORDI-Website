import type { StaticImageData } from 'next/image'
import type { Product } from '@/types/product'
import { isDarkHue } from '@/lib/utils'
import GoodBoyHero from '@/assets/products/good-boy/hero.webp'
import GoodBoyCampaign50 from '@/assets/products/good-boy/campaign_50ml.webp'
import GoodBoyCampaign12 from '@/assets/products/good-boy/campaign_12ml.webp'
import GoodBoyStudio12 from '@/assets/products/good-boy/studio_12ml.webp'
import HotDilfHero from '@/assets/products/hot-dilf/hero.webp'
import HotDilfCampaign50 from '@/assets/products/hot-dilf/campaign_50ml.webp'
import HotDilfCampaign12 from '@/assets/products/hot-dilf/campaign_12ml.webp'
import HotDilfStudio12 from '@/assets/products/hot-dilf/studio_12ml.webp'
import SeaBreezeHero from '@/assets/products/sea-breeze/hero.webp'
import SeaBreezeCampaign50 from '@/assets/products/sea-breeze/campaign_50ml.webp'
import SeaBreezeCampaign12 from '@/assets/products/sea-breeze/campaign_12ml.webp'
import SeaBreezeStudio12 from '@/assets/products/sea-breeze/studio_12ml.webp'
import DrowningLoveHero from '@/assets/products/drowning-love/hero.webp'
import DrowningLoveCampaign50 from '@/assets/products/drowning-love/campaign_50ml.webp'
import DrowningLoveCampaign12 from '@/assets/products/drowning-love/campaign_12ml.webp'
import DrowningLoveStudio12 from '@/assets/products/drowning-love/studio_12ml.webp'
import CloudFon50 from '@/assets/products/cloudfon/cloudfon_50ml.webp'
import CloudFon12 from '@/assets/products/cloudfon/cloudfon_12ml.webp'
import CloudFonDuo from '@/assets/products/cloudfon/cloudfon_duo.webp'
import CloudFonNotes from '@/assets/products/cloudfon/cloudfon_note_perfume.webp'
import CloudFonAvailable from '@/assets/products/cloudfon/cloudfon_available.webp'
import CloudFonStudio50 from '@/assets/products/cloudfon/studio_50ml.webp'
import CloudFonStudio12 from '@/assets/products/cloudfon/studio_12ml.webp'

/**
 * Studio photography that ships with the bundle. Products created in the admin
 * dashboard have no bundled art, so they carry an `image_url` instead.
 *
 * The hero is the bottle against studio white — the same frame for every
 * fragrance, so the shop grid reads as one collection rather than five moods.
 * N°05 is the exception: it launched on its campaign still and keeps it.
 * The styled shots are not lost, they moved down into the galleries below.
 *
 * Every frame is a 4:5 WebP derived from the masters in `assets/Photography/`,
 * which is git-ignored — 2.8 GB of PSD and full-resolution PNG that has no
 * business in a deploy. Re-derive with `cwebp -q 80`.
 */
export const productImages: Record<string, StaticImageData> = {
  'good-boy': GoodBoyHero,
  'hot-dilf': HotDilfHero,
  'sea-breeze': SeaBreezeHero,
  'drowning-love': DrowningLoveHero,
  'cloud-fon': CloudFon50,
}

export type GalleryPlate = {
  image: StaticImageData
  /** Alt text per language — these stills carry baked-in copy worth describing. */
  alt: { en: string; th: string }
}

/**
 * The three frames that sit under a studio-white hero: both bottles on the
 * fragrance's campaign set, then the 12ml back on white. Written as a helper
 * because the alt text only ever varies by name.
 *
 * The campaign 50ml leads, so it is also what the home-page featured band
 * picks up — that section reads `getProductGallery(id)[0]`.
 */
function shootPlates(
  name: string,
  frames: {
    campaign50: StaticImageData
    campaign12: StaticImageData
    studio12: StaticImageData
  }
): GalleryPlate[] {
  return [
    {
      image: frames.campaign50,
      alt: {
        en: `${name} 50ml eau de parfum on its campaign set`,
        th: `${name} ขนาด 50 มิลลิลิตร บนฉากแคมเปญ`,
      },
    },
    {
      image: frames.campaign12,
      alt: {
        en: `${name} 12ml — the travel bottle on the same set`,
        th: `${name} ขนาด 12 มิลลิลิตร บนฉากเดียวกัน`,
      },
    },
    {
      image: frames.studio12,
      alt: {
        en: `${name} 12ml eau de parfum against studio white`,
        th: `${name} ขนาด 12 มิลลิลิตร บนพื้นสตูดิโอสีขาว`,
      },
    },
  ]
}

/**
 * Extra stills shown under the hero on a product page. Only shoots that have
 * more than one frame appear here; everything else renders without a gallery.
 */
export const productGallery: Record<string, GalleryPlate[]> = {
  'good-boy': shootPlates('GOOD BOY', {
    campaign50: GoodBoyCampaign50,
    campaign12: GoodBoyCampaign12,
    studio12: GoodBoyStudio12,
  }),
  'hot-dilf': shootPlates('HOT DILF', {
    campaign50: HotDilfCampaign50,
    campaign12: HotDilfCampaign12,
    studio12: HotDilfStudio12,
  }),
  'sea-breeze': shootPlates('SEA BREEZE', {
    campaign50: SeaBreezeCampaign50,
    campaign12: SeaBreezeCampaign12,
    studio12: SeaBreezeStudio12,
  }),
  'drowning-love': shootPlates('DROWNING LOVE', {
    campaign50: DrowningLoveCampaign50,
    campaign12: DrowningLoveCampaign12,
    studio12: DrowningLoveStudio12,
  }),
  // N°05 keeps its launch campaign on the hero, so its gallery carries the
  // rest of that shoot and picks up the two studio frames at the end.
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
      image: CloudFonStudio50,
      alt: {
        en: 'CLOUD FON 50ml eau de parfum against studio white',
        th: 'เคล้าฝน ขนาด 50 มิลลิลิตร บนพื้นสตูดิโอสีขาว',
      },
    },
    {
      image: CloudFonStudio12,
      alt: {
        en: 'CLOUD FON 12ml eau de parfum against studio white',
        th: 'เคล้าฝน ขนาด 12 มิลลิลิตร บนพื้นสตูดิโอสีขาว',
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

/**
 * Bundled heroes that sit on a dark ground, so the labels printed over them
 * have to be drawn light.
 *
 * `hue` used to answer this on its own — it was the backdrop the art sat on.
 * Four of the five heroes are now a bottle on studio white while their hue is
 * still the mood colour of the fragrance, so hue says one thing and the
 * photograph says another. The labels follow the photograph.
 */
const DARK_HEROES = new Set(['cloud-fon'])

/** Whether the overlay labels on a product's hero need light ink. */
export function heroIsDark(
  product: Pick<Product, 'id' | 'image_url' | 'hue'>
): boolean {
  // Art uploaded from the dashboard is unknown to us; hue stays the only hint.
  if (product.image_url) return isDarkHue(product.hue)
  return DARK_HEROES.has(product.id)
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
