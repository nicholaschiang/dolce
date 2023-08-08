import { type ActionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function action({ request, params }: ActionArgs) {
  const lookId = Number(params.lookId)
  if (Number.isNaN(lookId)) throw new Response('Not Found', { status: 404 })
  const look = await prisma.look.findUnique({ where: { id: lookId } })
  if (look == null) throw new Response('Not Found', { status: 404 })
  const userId = await requireUserId(request, `/shows/${look.showId}`)
  const formData = await request.formData()
  const setId = Number(formData.get('setId'))
  if (Number.isNaN(setId)) throw new Response('Bad Request', { status: 400 })
  const set = await prisma.set.findUnique({ where: { id: setId } })
  if (set == null) throw new Response('Not Found', { status: 404 })
  if (set.authorId !== userId) throw new Response('Forbidden', { status: 403 })
  switch (request.method) {
    case 'POST': {
      await prisma.look.update({
        where: { id: lookId },
        data: { sets: { connect: { id: setId } } },
      })
      break
    }
    case 'DELETE': {
      await prisma.look.update({
        where: { id: lookId },
        data: { sets: { disconnect: { id: setId } } },
      })
      break
    }
    default:
      throw new Response('Method Not Allowed', { status: 405 })
  }
  return new Response(null, { status: 204 })
}
