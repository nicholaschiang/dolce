import { Link, useLoaderData } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { type SitemapFunction } from 'remix-sitemap'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { type Handle } from 'root'
import { NAME, invert } from 'utils'
import { cn } from 'utils/cn'
import { getScores } from 'utils/scores.server'
import { SEASON_NAME_TO_SLUG } from 'utils/season'
import { SEX_TO_SLUG } from 'utils/sex'
import { getShowKeywords, getShowPath, getShowSchema } from 'utils/show'

import { ConsumerReviews } from './consumer-reviews'
import { CriticReviews } from './critic-reviews'
import { Designers } from './designers'
import { RateAndReview, getReview } from './rate-and-review'
import { ScoresHeader } from './scores-header'
import { ShowInfo } from './show-info'
import { WhatToKnow } from './what-to-know'
import { WhereToBuy } from './where-to-buy'

export { action } from './rate-and-review'

// Eagerly load images for the first three rows of looks (above the fold).
const rowsToEagerLoad = 3

// How many looks are shown in each row of results.
const looksPerRow = 2

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) return [{ title: `404 | ${NAME}` }]
  const keywords = getShowKeywords(data).join(', ')
  return [
    { title: `${data.name} Collection | ${NAME}` },
    {
      name: 'description',
      content: `${data.name} collection, runway looks, beauty, models, and reviews.`,
    },
    { name: 'keywords', content: keywords },
    { name: 'news_keywords', content: keywords },
    { name: 'content-type', content: 'fashionshow' },
    { 'script:ld+json': getShowSchema(data) },
  ]
}

export const sitemap: SitemapFunction = async () => {
  const shows = await prisma.show.findMany({
    include: { season: true, brand: true },
    orderBy: { name: 'asc' },
  })
  return shows.map((show) => ({
    loc: getShowPath(show),
    lastmod: show.updatedAt.toISOString(),
  }))
}

export const handle: Handle = {
  breadcrumb: (match) => {
    const data = match.data as SerializeFrom<typeof loader> | undefined
    return (
      <Link prefetch='intent' to={data ? getShowPath(data) : '.'}>
        {data?.name ?? '404'}
      </Link>
    )
  },
}

export async function loader({ request, params }: LoaderArgs) {
  log.debug('getting show...')
  const seasonYear = Number(params.seasonYear)
  const miss = new Response(null, { status: 404, statusText: 'Not Found' })
  if (Number.isNaN(seasonYear) || !params.seasonName || !params.brandSlug)
    throw miss
  const seasonName = invert(SEASON_NAME_TO_SLUG)[params.seasonName]
  const sex = invert(SEX_TO_SLUG)[params.sex ?? '']
  if (!sex || !seasonName) throw miss
  const show = await prisma.show.findFirst({
    where: {
      brand: { slug: params.brandSlug },
      season: { year: seasonYear, name: seasonName },
      sex,
    },
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
      looks: {
        include: { images: true, model: true },
        orderBy: { number: 'asc' },
      },
    },
  })
  if (show == null) throw miss
  log.debug('got show %o', show)
  const [scores, review] = await Promise.all([
    getScores(show.id),
    getReview(show.id, request),
  ])
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
                src={look.images[0]?.url}
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
