import { type DataFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function action({ request, params }: DataFunctionArgs) {
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

  const setId = Number((await request.formData()).get('setId'))
  if (Number.isNaN(setId)) throw new Response('Bad Request', { status: 400 })

  const set = await prisma.set.findUnique({ where: { id: setId } })
  if (set == null) throw new Response('Not Found', { status: 404 })
  if (set.authorId !== userId) throw new Response('Forbidden', { status: 403 })

  switch (request.method) {
    case 'POST': {
      await prisma.variant.update({
        where: { id: variantId },
        data: { sets: { connect: { id: setId } } },
      })
      break
    }
    case 'DELETE': {
      await prisma.variant.update({
        where: { id: variantId },
        data: { sets: { disconnect: { id: setId } } },
      })
      break
    }
    default:
      throw new Response('Method Not Allowed', { status: 405 })
  }

  return new Response(null, { status: 204 })
}
