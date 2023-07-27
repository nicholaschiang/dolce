import { Link, useLoaderData } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { type Handle } from 'root'
import { cn } from 'utils/cn'
import { getShowSeason } from 'utils/show'

import { ConsumerReviews } from './consumer-reviews'
import { CriticReviews } from './critic-reviews'
import { Designers } from './designers'
import { RateAndReview, getReview } from './rate-and-review'
import { ScoresHeader, getScores } from './scores-header'
import { ShowInfo } from './show-info'
import { WhatToKnow } from './what-to-know'
import { WhereToBuy } from './where-to-buy'

export { action } from './rate-and-review'

// Eagerly load images for the first three rows of looks (above the fold).
const rowsToEagerLoad = 3

// How many looks are shown in each row of results.
const looksPerRow = 2

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) return [{ title: '404 | Nicholas Chiang' }]
  const keywords = [
    data.brand.name,
    getShowSeason(data),
    'runway_review',
    'runway',
  ].join(', ')
  return [
    { title: `${data.name} Collection | Nicholas Chiang` },
    {
      name: 'description',
      content: `${data.name} collection, runway looks, beauty, models, and reviews.`,
    },
    { name: 'keywords', content: keywords },
    { name: 'news_keywords', content: keywords },
    { name: 'content-type', content: 'fashionshow' },
  ]
}

export const handle: Handle = {
  breadcrumb: (match) => (
    <Link prefetch='intent' to={`/shows/${match.params.showId as string}`}>
      {(match.data as SerializeFrom<typeof loader>)?.name ?? '404'}
    </Link>
  ),
}

export async function loader({ request, params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const [show, scores, review] = await Promise.all([
    prisma.show.findUnique({
      where: { id: showId },
      include: {
        video: true,
        season: true,
        brand: true,
        collections: {
          include: {
            links: { include: { brand: true, retailer: true } },
            designers: true,
          },
        },
        reviews: {
          include: { author: true, publication: true },
          orderBy: { updatedAt: 'desc' },
        },
        looks: { include: { image: true }, orderBy: { number: 'asc' } },
      },
    }),
    getScores(showId),
    getReview(showId, request),
  ])
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  return { ...show, scores, review }
}

export default function ShowPage() {
  return (
    <main className='fixed inset-0 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5 gap-6'>
      <About className='col-span-3 pl-6 pb-6 pt-16' />
      <Looks className='col-span-2 pr-6 pb-6 pt-16' />
    </main>
  )
}

function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
      <ol
        className='grid gap-x-2 gap-y-6'
        style={{
          gridTemplateColumns: `repeat(${looksPerRow}, minmax(0, 1fr))`,
        }}
      >
        {show.looks.map((look, index) => (
          <li key={look.id}>
            <div className='bg-gray-100 dark:bg-gray-900 aspect-person'>
              <img
                className='object-cover h-full w-full'
                loading={
                  index < looksPerRow * rowsToEagerLoad ? 'eager' : 'lazy'
                }
                decoding={
                  index < looksPerRow * rowsToEagerLoad ? 'sync' : 'async'
                }
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
    <div className={cn('overflow-auto', className)}>
      <ScoresHeader />
      <WhatToKnow />
      <Designers />
      <WhereToBuy />
      <RateAndReview />
      <ConsumerReviews />
      <ShowInfo />
      <CriticReviews />
    </div>
  )
}
