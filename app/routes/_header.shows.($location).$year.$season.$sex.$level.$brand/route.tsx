import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import { useState } from 'react'
import { type SitemapFunction } from 'remix-sitemap'

import { ClientOnly } from 'components/client-only'

import { NAME, invert, useLayoutEffect } from 'utils/general'
import { LEVEL_TO_SLUG } from 'utils/level'
import { LOCATION_TO_SLUG } from 'utils/location'
import { getScores } from 'utils/scores.server'
import { SEASON_NAME_TO_SLUG } from 'utils/season'
import { SEX_TO_SLUG } from 'utils/sex'
import {
  getShowKeywords,
  getShowPath,
  getShowSchema,
  getShowSeason,
} from 'utils/show'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'
import { getUserId } from 'session.server'

import { About } from './about'
import { Looks } from './looks'
import { getReview } from './rate-and-review'

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
    if (data == null) return []
    const filter: Filter<'brand', 'is'> = {
      id: nanoid(5),
      name: 'brand',
      condition: 'is',
      value: { id: data.brand.id, name: data.brand.name },
    }
    const param = filterToSearchParam<'brand', 'is'>(filter)
    return [
      {
        to: `/shows?${FILTER_PARAM}=${encodeURIComponent(param)}`,
        children: data.brand.name,
      },
      {
        to: getShowPath(data),
        children: getShowSeason(data),
      },
    ]
  },
}

export async function loader({ request, params }: LoaderArgs) {
  log.info('getting show... %o', params)
  const miss = new Response(null, { status: 404, statusText: 'Not Found' })
  if (!params.season || !params.sex || !params.level || !params.brand)
    throw miss
  const seasonYear = Number(params.year)
  const seasonName = invert(SEASON_NAME_TO_SLUG)[params.season]
  const sex = invert(SEX_TO_SLUG)[params.sex]
  const level = invert(LEVEL_TO_SLUG)[params.level]
  const location = params.location
    ? invert(LOCATION_TO_SLUG)[params.location]
    : null
  if (
    Number.isNaN(seasonYear) ||
    !seasonName ||
    !sex ||
    !level ||
    location === undefined
  )
    throw miss
  const userId = await getUserId(request)
  const show = await prisma.show.findFirst({
    where: {
      brand: { slug: params.brand },
      season: { year: seasonYear, name: seasonName },
      location,
      level,
      sex,
    },
    include: {
      video: true,
      season: true,
      brand: true,
      collections: {
        include: {
          links: { include: { brand: true, retailer: true } },
          designers: {
            include: { articles: { orderBy: { writtenAt: 'desc' }, take: 1 } },
          },
        },
      },
      reviews: { include: { author: true }, orderBy: { updatedAt: 'desc' } },
      articles: {
        include: { author: true, publication: true },
        orderBy: { writtenAt: 'desc' },
      },
      looks: {
        include: {
          images: { orderBy: { createdAt: 'desc' }, take: 1 },
          model: true,
          sets: userId ? { where: { authorId: userId } } : false,
        },
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

// The ratio of the "about" column width to "looks" column width.
const about = 4 / 7
const looks = 3 / 7

// The max width of both columns combined.
const maxWidth = 1300

export default function ShowPage() {
  const [viewportWidth, setViewportWidth] = useState(maxWidth)
  useLayoutEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const margin = Math.max((viewportWidth - maxWidth) / 2, 0)
  const aboutWidth = maxWidth * about + margin
  const looksWidth = maxWidth * looks + margin
  const aboutFlexGrow = aboutWidth / looksWidth
  const looksFlexGrow = 1
  return (
    <ClientOnly>
      <main className='sm:fixed sm:inset-0 sm:overflow-hidden sm:flex sm:p-0 p-6'>
        <div
          className='sm:w-0 sm:overflow-auto'
          style={{ flexGrow: aboutFlexGrow }}
        >
          <div
            className='sm:pt-16 sm:pl-6 pb-6 sm:ml-auto w-full'
            style={{
              maxWidth: viewportWidth > maxWidth ? maxWidth * about : undefined,
            }}
          >
            <About />
          </div>
        </div>
        <div
          className='sm:w-0 sm:overflow-auto'
          style={{ flexGrow: looksFlexGrow }}
        >
          <div
            className='sm:px-6 sm:pt-16 sm:pb-6 sm:mr-auto w-full sm:max-w-auto'
            style={{
              maxWidth: viewportWidth > maxWidth ? maxWidth * looks : undefined,
            }}
          >
            <Looks />
          </div>
        </div>
      </main>
    </ClientOnly>
  )
}