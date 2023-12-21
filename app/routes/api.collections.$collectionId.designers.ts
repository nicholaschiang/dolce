import { type ActionFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

export async function action({ request, params }: ActionFunctionArgs) {
  const collectionId = Number(params.collectionId)
  if (Number.isNaN(collectionId))
    throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null) throw new Response('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user == null) throw new Response('Not Found', { status: 404 })
  if (user.curator === false) throw new Response('Forbidden', { status: 403 })

  const formData = await request.formData()
  const designerId = Number(formData.get('designerId'))
  if (Number.isNaN(designerId))
    throw new Response('Bad Request', { status: 400 })

  const collection = await prisma.collection.update({
    where: { id: collectionId },
    data: { designers: { connect: { id: designerId } } },
  })
  return collection
}
