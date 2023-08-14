import { Link, useLoaderData } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'

import { getBrandSchema } from 'utils/brand'
import { NAME } from 'utils/general'
import { getShowSeason, getShowPath } from 'utils/show'

import { prisma } from 'db.server'
import { type Handle } from 'root'

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) return [{ title: `404 | ${NAME}` }]
  return [
    {
      title: `${data.name} News, Collections, Fashion Shows, Fashion Week Reviews, and More | ${NAME}`,
    },
    {
      name: 'description',
      content: `Your source for the latest ${data.name} news, updates, collections, fashion show reviews, photos, and videos.`,
    },
    { 'script:ld+json': getBrandSchema(data) },
  ]
}

export const handle: Handle = {
  breadcrumb: (match) => {
    const data = match.data as SerializeFrom<typeof loader> | undefined
    return {
      to: data ? `/shows/brands/${data.slug}` : '.',
      children: data?.name ?? '404',
    }
  },
}

export async function loader({ params }: LoaderArgs) {
  if (params.brand == null) throw new Response('Not Found', { status: 404 })
  const brand = await prisma.brand.findUnique({
    where: { slug: params.brand },
    include: {
      shows: {
        include: {
          season: true,
          brand: true,
          collections: true,
          looks: {
            include: { images: { take: 1 } },
            orderBy: { number: 'asc' },
          },
        },
        orderBy: [
          { brand: { name: 'asc' } },
          { season: { year: 'desc' } },
          { season: { name: 'asc' } },
          { level: 'asc' },
          { sex: 'asc' },
        ],
      },
    },
  })
  if (brand == null) throw new Response('Not Found', { status: 404 })
  return brand
}

export default function BrandPage() {
  const brand = useLoaderData<typeof loader>()
  return (
    <main className='px-6 pb-6 mx-auto max-w-screen-xl'>
      <h1 className='text-lg mt-2 mb-8 h-7 lowercase tracking-tighter'>
        {brand.shows.length.toLocaleString()} shows
      </h1>
      <ol className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-8'>
        {brand.shows.map((show) => (
          <li key={show.id}>
            <Link to={getShowPath(show)} prefetch='intent' className='block'>
              <div className='w-full aspect-person bg-gray-100 dark:bg-gray-900 mb-3'>
                <img
                  src={show.looks[0].images[0].url}
                  alt=''
                  className='object-cover h-full w-full'
                />
              </div>
              <h2 className='text-xl font-serif font-semibold text-center leading-none mb-1'>
                {show?.brand.name}
              </h2>
              <h3 className='text-xs uppercase text-center'>
                {show ? getShowSeason(show) : ''}
              </h3>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
