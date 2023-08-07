import { type ActionArgs, redirect } from '@vercel/remix'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

export async function action({ request, params }: ActionArgs) {
  const lookId = Number(params.lookId)
  if (Number.isNaN(lookId)) throw new Response('Not Found', { status: 404 })
  const look = await prisma.look.findUnique({ where: { id: lookId } })
  if (look == null) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null) return redirect(`/login?redirectTo=/shows/${look.showId}`)
  const set = { name: 'DEFAULT', authorId: userId }
  switch (request.method) {
    case 'POST': {
      await prisma.look.update({
        where: { id: lookId },
        data: {
          sets: {
            connectOrCreate: { where: { name_authorId: set }, create: set },
          },
        },
      })
      break
    }
    case 'DELETE': {
      await prisma.look.update({
        where: { id: lookId },
        data: { sets: { disconnect: { name_authorId: set } } },
      })
      break
    }
    default:
      throw new Response('Method Not Allowed', { status: 405 })
  }
  return new Response(null, { status: 204 })
}
