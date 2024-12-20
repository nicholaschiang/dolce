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

  const setId = Number((await request.formData()).get('setId'))
  if (Number.isNaN(setId)) throw new Response('Bad Request', { status: 400 })

  const set = await prisma.board.findUnique({ where: { id: setId } })
  if (set == null) throw new Response('Not Found', { status: 404 })
  if (set.authorId !== userId) throw new Response('Forbidden', { status: 403 })

  switch (request.method) {
    case 'POST': {
      await prisma.look.update({
        where: { id: lookId },
        data: { boards: { connect: { id: setId } } },
      })
      break
    }
    case 'DELETE': {
      await prisma.look.update({
        where: { id: lookId },
        data: { boards: { disconnect: { id: setId } } },
      })
      break
    }
    default:
      throw new Response('Method Not Allowed', { status: 405 })
  }

  return new Response(null, { status: 204 })
}
