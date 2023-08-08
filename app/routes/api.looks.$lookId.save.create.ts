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
  const formData = await request.formData()
  const name = formData.get('name')
  if (typeof name !== 'string')
    throw new Response('Bad Request', { status: 400 })
  await prisma.look.update({
    where: { id: lookId },
    data: { sets: { create: { name, authorId: userId } } },
  })
  return new Response(null, { status: 204 })
}
