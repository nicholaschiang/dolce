import { type ActionFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function action({ request, params }: ActionFunctionArgs) {
  const lookId = Number(params.lookId)
  if (Number.isNaN(lookId)) throw new Response('Not Found', { status: 404 })

  const look = await prisma.look.findUnique({ where: { id: lookId } })
  if (look == null) throw new Response('Not Found', { status: 404 })

  const userId = await requireUserId(
    request,
    `/collections/${look.collectionId}`,
  )

  const formData = await request.formData()
  const name = formData.get('name') || 'DEFAULT'
  if (typeof name !== 'string')
    throw new Response('Bad Request', { status: 400 })

  await prisma.look.update({
    where: { id: lookId },
    data: { boards: { create: { name, authorId: userId } } },
  })

  return new Response(null, { status: 204 })
}
