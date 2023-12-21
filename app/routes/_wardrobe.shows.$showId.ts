import { type LoaderFunctionArgs, redirect } from '@vercel/remix'

import { getShowPath } from 'utils/show'

import { prisma } from 'db.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
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
