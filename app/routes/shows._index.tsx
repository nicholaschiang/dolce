import { Link, useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { cn } from 'utils/cn'

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
    <main className='p-6 mx-auto max-w-screen-xl'>
      <h1 className='text-6xl mb-6'>shows</h1>
      <ScoreKey className='mb-2' />
      {shows.length > 0 ? (
        <ul className='grid grid-cols-5 gap-x-2 gap-y-10'>
          {shows.map((show) => (
            <li key={show.id}>
              <Link to={`/shows/${show.id}`}>
                <div className='bg-gray-100 dark:bg-gray-900 aspect-person mb-2'>
                  <img
                    className='object-cover h-full'
                    src={show.looks[0].image.url}
                    alt=''
                  />
                </div>
                <h2 className='text-xl font-serif font-semibold text-center'>
                  {show.brands.map((brand) => brand.name).join(', ')}
                </h2>
                <h3 className='text-xs uppercase text-center'>
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

function ScoreKey({ className }: { className: string }) {
  const scores = [40, 50, 60, 70, 80, 90]
  return (
    <section
      className={cn(
        'flex gap-4 bg-gray-100 dark:bg-gray-900 p-4 items-center',
        className,
      )}
    >
      <ol className='flex gap-2 px-2'>
        {scores.map((score) => (
          <li key={score} className='flex flex-col gap-0.5 items-center'>
            <img className='w-12 mt-2' src={`/flowers/${score}.png`} alt='' />
            <span className='text-xs font-serif font-black'>{`${score}%`}</span>
          </li>
        ))}
      </ol>
      <article className='text-sm'>
        <h2 className='font-medium'>What do the roses mean?</h2>
        <p>Rose growth indicates a more positively reviewed show.</p>
        <p>
          <i>
            Ex: When at least 60% of reviews for a show are positive, a
            blossoming rose is displayed to indicate its popularity.
          </i>
        </p>
        <p>
          <i>
            Ex: When less than 50% of reviews for a show are positive, an
            unblossomed rose bud is displayed to indicate its unpopularity.
          </i>
        </p>
      </article>
    </section>
  )
}
