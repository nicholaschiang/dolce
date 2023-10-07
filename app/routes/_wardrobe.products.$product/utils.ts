import { useLoaderData, useParams } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'

import { type loader } from './route'

type Variant = SerializeFrom<typeof loader>['variants'][number]

export function useVariant(): Variant | undefined {
  const product = useLoaderData<typeof loader>()
  const { variantId } = useParams()
  return product.variants.find((v) => v.id.toString() === variantId)
}
