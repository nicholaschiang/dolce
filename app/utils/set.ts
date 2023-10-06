import {
  type Variant,
  type Image,
  type Look,
  type Product,
} from '@prisma/client'

import { type Serialize } from 'utils/general'

// The name of the "Own" and "Want" sets. These are hard-coded values for now.
export const OWN_SET_NAME = 'OWN'
export const WANT_SET_NAME = 'WANT'

export type SetItem = {
  id: number
  url: string
  images: Serialize<Image>[]
  updatedAt: Serialize<Date>
}

export function getItems({
  variants,
  looks,
}: {
  variants: Serialize<Variant & { images: Image[]; product: Product }>[]
  looks: Serialize<Look & { images: Image[] }>[]
}): SetItem[] {
  const items = [
    ...variants.map((v) => ({
      id: v.id,
      url: `/products/${v.product.slug}/variants/${v.id}`,
      images: v.images,
      updatedAt: new Date(v.updatedAt),
    })),
    ...looks.map((l) => ({
      id: l.id,
      url: `/shows/${l.showId}`,
      images: l.images,
      updatedAt: new Date(l.updatedAt),
    })),
  ]
  // TODO make the relation table between sets and variants/looks an explicit
  // table with a `createdAt` column so that I can sort by the most recently
  // saved looks/variants instead of simply the most recently updated items.
  items.sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())
  return items
}
