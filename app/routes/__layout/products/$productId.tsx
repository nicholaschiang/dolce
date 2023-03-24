import type { LoaderFunction } from '@remix-run/node'
import type { Product } from '@prisma/client'
import invariant from 'tiny-invariant'
import { useLoaderData } from '@remix-run/react'

import { prisma } from 'db.server'

export type LoaderData = Product

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.productId, 'productId is required')
  const id = Number(params.productId)
  if (Number.isNaN(id))
    throw new Response('productId must be a number', { status: 400 })
  const product = await prisma.product.findUnique({ where: { id } })
  if (product === undefined) throw new Response('Not Found', { status: 404 })
  return product
}

export default function ProductPage() {
  const product = useLoaderData<LoaderData>()
  return (
    <main className='flex flex-1 items-center justify-center px-6'>
      <h1>{product.name}</h1>
      <span className='mx-2'>·</span>
      <p>{product.level}</p>
      <span className='mx-2'>·</span>
      <p>${product.msrp}</p>
    </main>
  )
}
