import { Link, useLoaderData } from '@remix-run/react'
import { type V2_MetaFunction } from '@vercel/remix'

import { Empty } from 'components/empty'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getShowSeason } from 'utils/show'

export const meta: V2_MetaFunction = () => [
  {
    title:
      'Fashion Shows: Fashion Week, Runway, Designer Collections | Nicholas Chiang',
  },
]

export async function loader() {
  log.debug('getting shows...')
  const shows = await prisma.show.findMany({
    include: {
      season: true,
      brands: true,
      collections: true,
      looks: { include: { image: true }, orderBy: { number: 'asc' }, take: 1 },
    },
    orderBy: [
      { season: { year: 'desc' } },
      { season: { name: 'desc' } },
      { name: 'asc' },
    ],
  })
  log.debug('got %d shows', shows.length)
  return shows
}

export default function ShowsPage() {
  const shows = useLoaderData<typeof loader>()
  return (
    <main className='p-6 mx-auto max-w-screen-xl'>
      <h1 className='text-6xl mb-6'>shows</h1>
      {shows.length > 0 ? (
        <ul className='grid grid-cols-5 gap-x-2 gap-y-10'>
          {shows.map((show) => (
            <li key={show.id}>
              <Link to={`/shows/${show.id}`}>
                <div className='bg-gray-100 dark:bg-gray-900 aspect-person mb-2'>
                  <img
                    className='object-cover h-full w-full'
                    src={show.looks[0].image.url}
                    alt=''
                  />
                </div>
                <h2 className='text-xl font-serif font-semibold text-center'>
                  {show.brands.map((brand) => brand.name).join(', ')}
                </h2>
                <h3 className='text-xs uppercase text-center'>
                  {getShowSeason(show)}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          There are no fashion shows to show yet. Please come again later.
        </Empty>
      )}
    </main>
  )
}
