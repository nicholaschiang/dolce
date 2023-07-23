import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, type SerializeFrom } from '@vercel/remix'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { type Handle } from 'root'
import { cn } from 'utils/cn'

import { Reviews } from './reviews'
import { ScoresHeader, getScores } from './scores-header'
import { ShowInfo } from './show-info'
import { WhatToKnow } from './what-to-know'
import { WhereToBuy } from './where-to-buy'

export const handle: Handle = {
  breadcrumb: (match) => (
    <Link to={`/shows/${match.params.showId as string}`}>
      {(match.data as SerializeFrom<typeof loader>)?.name ?? '404'}
    </Link>
  ),
}

export async function loader({ params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const [show, scores] = await Promise.all([
    prisma.show.findUnique({
      where: { id: showId },
      include: {
        video: true,
        season: true,
        brands: true,
        collections: {
          include: { links: { include: { brand: true, retailer: true } } },
        },
        reviews: { include: { author: true, publication: true } },
        looks: { include: { image: true }, orderBy: { number: 'asc' } },
      },
    }),
    getScores(showId),
  ])
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  return { ...show, scores }
}

export default function ShowPage() {
  return (
    <main className='fixed inset-0 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5 gap-6 px-6'>
      <About className='col-span-3 pb-6 pt-16' />
      <Looks className='col-span-2 pb-6 pt-16' />
    </main>
  )
}

function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
      <ol className='grid grid-cols-2 gap-x-2 gap-y-6'>
        {show.looks.map((look) => (
          <li key={look.id}>
            <div className='bg-gray-100 dark:bg-gray-800 aspect-person'>
              <img
                className='object-cover h-full'
                src={look.image.url}
                alt=''
              />
            </div>
            <p className='mt-0.5 text-sm'>Look {look.number}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function About({ className }: { className: string }) {
  return (
    <div className={cn('overflow-auto grid gap-10', className)}>
      <ScoresHeader />
      <WhatToKnow />
      <WhereToBuy />
      <ShowInfo />
      <Reviews />
    </div>
  )
}
