import { type LoaderFunctionArgs, redirect } from '@vercel/remix'
import invariant from 'tiny-invariant'

import { Empty } from 'components/empty'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.product, 'product is required')
  const product = await prisma.product.findUnique({
    where: { slug: params.product },
    include: { variants: { orderBy: { createdAt: 'asc' } } },
  })
  const variant = product?.variants[0]
  return variant ? redirect(`variants/${variant.id}`) : {}
}

export default function EmptyPage() {
  return (
    <Empty className='m-2'>Please select a color to see product photos.</Empty>
  )
}
