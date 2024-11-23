import { type LoaderFunctionArgs, redirect } from '@vercel/remix'

import { getCollectionPath } from 'utils/collection'

import { prisma } from 'db.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const collectionId = Number(params.collectionId)
  if (Number.isNaN(collectionId))
    throw new Response('Not Found', { status: 404 })
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: { season: true, brand: true },
  })
  if (collection == null) throw new Response('Not Found', { status: 404 })
  const url = new URL(request.url)
  const uri = `${getCollectionPath(collection)}${url.search}${url.hash}`
  return redirect(uri, { status: 308 })
}
