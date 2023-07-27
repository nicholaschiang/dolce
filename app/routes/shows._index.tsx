import { Link, useLoaderData } from '@remix-run/react'
import { type V2_MetaFunction } from '@vercel/remix'

import { Empty } from 'components/empty'
import { Image } from 'components/image'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getShowSeason } from 'utils/show'

export const meta: V2_MetaFunction = () => [
  {
    title:
      'Fashion Shows: Fashion Week, Runway, Designer Collections | Nicholas Chiang',
  },
  {
    name: 'description',
    content:
      'Get up-to-the-minute fashion show coverage at New York, London, ' +
      'Milan, and Paris Fashion Weeks. See photos, videos, reviews, and more.',
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
    orderBy: { name: 'asc' },
  })
  log.debug('got %d shows', shows.length)
  return shows
}

// Eagerly load images for the first two rows of shows (above the fold).
const rowsToEagerLoad = 2

// How many shows are shown in each row of results.
const showsPerRow = 5

export default function ShowsPage() {
  const shows = useLoaderData<typeof loader>()
  return (
    <main className='p-6 mx-auto max-w-screen-xl'>
      <h1 className='text-6xl mb-6'>shows</h1>
      {shows.length > 0 ? (
        <ul
          className='grid gap-x-2 gap-y-10'
          style={{
            gridTemplateColumns: `repeat(${showsPerRow}, minmax(0, 1fr))`,
          }}
        >
          {shows.map((show, index) => (
            <li key={show.id}>
              <Link prefetch='intent' to={`/shows/${show.id}`}>
                <div className='bg-gray-100 dark:bg-gray-900 aspect-person mb-2'>
                  <Image
                    className='object-cover h-full w-full'
                    loading={
                      index < showsPerRow * rowsToEagerLoad ? 'eager' : 'lazy'
                    }
                    decoding={
                      index < showsPerRow * rowsToEagerLoad ? 'sync' : 'async'
                    }
                    src={show.looks[0].image.url}
                    responsive={[
                      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
                    ].map((width) => ({
                      size: { width },
                      maxWidth: width * showsPerRow,
                    }))}
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
