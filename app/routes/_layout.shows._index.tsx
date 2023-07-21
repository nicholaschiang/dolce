import { Link, useLoaderData } from '@remix-run/react'

import { Empty } from 'atoms/Empty'

import { prisma } from 'db.server'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting shows...')
  const shows = await prisma.show.findMany({
    include: {
      season: true,
      brands: true,
      looks: { include: { image: true }, orderBy: { number: 'asc' }, take: 1 },
    },
    orderBy: { name: 'asc' },
  })
  log.debug('got %d shows', shows.length)
  return shows
}

export default function ShowsPage() {
  const shows = useLoaderData<typeof loader>()
  return (
    <main className='h-full w-full flex-1 overflow-auto p-6'>
      <h1 className='text-6xl text-center mb-6'>shows</h1>
      {shows.length > 0 ? (
        <ul className='grid grid-cols-5 gap-x-2 gap-y-10 mx-auto max-w-screen-xl'>
          {shows.map((show) => (
            <li key={show.id}>
              <Link to={`/shows/${show.id}`} className='text-center'>
                <div className='bg-gray-100 dark:bg-gray-800 aspect-person mb-2'>
                  <img
                    className='object-cover h-full'
                    src={show.looks[0].image.url}
                    alt=''
                  />
                </div>
                <h2 className='text-xl font-serif font-semibold'>
                  {show.brands.map((brand) => brand.name).join(', ')}
                </h2>
                <h3 className='text-xs uppercase'>
                  {show.season.name.replace('_', '-')} {show.season.year}
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
