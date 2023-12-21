import { type LoaderFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function action({ request, params }: LoaderFunctionArgs) {
  const variantId = Number(params.variantId)
  if (Number.isNaN(variantId)) throw new Response('Not Found', { status: 404 })

  const variant = await prisma.variant.findUnique({
    include: { product: true },
    where: { id: variantId },
  })
  if (variant == null) throw new Response('Not Found', { status: 404 })

  const userId = await requireUserId(
    request,
    `/products/${variant.product.slug}/variants/${variant.id}`,
  )

  const formData = await request.formData()
  const name = formData.get('name') || 'DEFAULT'
  if (typeof name !== 'string')
    throw new Response('Bad Request', { status: 400 })

  await prisma.variant.update({
    where: { id: variantId },
    data: { sets: { create: { name, authorId: userId } } },
  })

  return new Response(null, { status: 204 })
}
