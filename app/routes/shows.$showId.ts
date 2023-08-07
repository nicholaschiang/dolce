import { type LoaderArgs, redirect } from '@vercel/remix'

import { prisma } from 'db.server'
import { getShowPath } from 'utils/show'

export async function loader({ request, params }: LoaderArgs) {
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response('Not Found', { status: 404 })
  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: { season: true, brand: true },
  })
  if (show == null) throw new Response('Not Found', { status: 404 })
  const url = new URL(request.url)
  const uri = `${getShowPath(show)}${url.search}${url.hash}`
  return redirect(uri, { status: 308 })
}
