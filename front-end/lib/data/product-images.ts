import type { StaticImageData } from 'next/image'
import GoodBoy from '@/assets/products/good_boy_1.jpg'
import HotDilf from '@/assets/products/hot_dilf_1.jpg'
import SeaBreeze from '@/assets/products/sea_breeze_1.jpg'
import DrowningLove from '@/assets/products/drowning_love_1.jpg'

export const productImages: Record<string, StaticImageData> = {
  'good-boy': GoodBoy,
  'hot-dilf': HotDilf,
  'sea-breeze': SeaBreeze,
  'drowning-love': DrowningLove,
}

export function getProductImage(id: string): StaticImageData | undefined {
  return productImages[id]
}
