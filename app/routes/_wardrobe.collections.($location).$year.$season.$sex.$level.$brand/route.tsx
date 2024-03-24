import {
  type LoaderFunctionArgs,
  type SerializeFrom,
  type MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import { type SitemapFunction } from 'remix-sitemap'

import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
} from 'components/layout'

import {
  getCollectionKeywords,
  getCollectionPath,
  getCollectionSchema,
  getCollectionSeason,
} from 'utils/collection'
import { NAME, invert } from 'utils/general'
import { LEVEL_TO_SLUG } from 'utils/level'
import { LOCATION_TO_SLUG } from 'utils/location'
import { getScores } from 'utils/scores.server'
import { SEASON_NAME_TO_SLUG } from 'utils/season'
import { SEX_TO_SLUG } from 'utils/sex'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'
import { getUserId } from 'session.server'

import { ConsumerReviews } from './consumer-reviews'
import { CriticReviews } from './critic-reviews'
import { Designers } from './designers'
import { Header } from './header'
import { Looks } from './looks'
import { Properties } from './properties'
import { RateAndReview, getReview } from './rate-and-review'
import { Video } from './video'
import { WhatToKnow } from './what-to-know'
import { WhereToBuy } from './where-to-buy'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) return [{ title: `404 | ${NAME}` }]
  const keywords = getCollectionKeywords(data).join(', ')
  return [
    {
      title: `${data.brand.name} ${getCollectionSeason(data)} Collection | ${NAME}`,
    },
    {
      name: 'description',
      content: `${data.name} collection, runway looks, beauty, models, and reviews.`,
    },
    { name: 'keywords', content: keywords },
    { name: 'news_keywords', content: keywords },
    { name: 'content-type', content: 'fashioncollection' },
    { 'script:ld+json': getCollectionSchema(data) },
  ]
}

export const sitemap: SitemapFunction = async () => {
  const collections = await prisma.collection.findMany({
    include: { season: true, brand: true },
    orderBy: { name: 'asc' },
  })
  return collections.map((collection) => ({
    loc: getCollectionPath(collection),
    lastmod: collection.updatedAt.toISOString(),
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
      { to: '/collections', children: 'Collections' },
      {
        to: `/collections?${FILTER_PARAM}=${encodeURIComponent(param)}`,
        children: data.brand.name,
      },
      {
        to: getCollectionPath(data),
        children: getCollectionSeason(data),
      },
    ]
  },
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  log.info('getting collection... %o', params)
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
  const collection = await prisma.collection.findFirst({
    where: {
      brand: { slug: params.brand },
      season: { year: seasonYear, name: seasonName },
      location,
      level,
      sex,
    },
    include: {
      season: true,
      brand: true,
      shows: { include: { video: true } },
      links: { include: { brand: true, retailer: true } },
      designers: {
        include: { articles: { orderBy: { writtenAt: 'desc' }, take: 1 } },
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
          boards: userId ? { where: { authorId: userId } } : false,
        },
        orderBy: { number: 'asc' },
      },
    },
  })
  if (collection == null) throw miss
  log.debug('got collection %o', collection)
  const [scores, review] = await Promise.all([
    getScores(collection.id),
    getReview(collection.id, request),
  ])
  return { ...collection, scores, review }
}

export default function CollectionPage() {
  return (
    <Layout>
      <LayoutLeft>
        <Video className='flex-none pt-2 px-2 w-full' />
        <Looks className='h-0 grow py-2 pl-2 overflow-x-auto overflow-y-hidden' />
      </LayoutLeft>
      <LayoutDivider />
      <LayoutRight>
        <Header />
        <WhatToKnow />
        <Designers />
        <WhereToBuy />
        <RateAndReview />
        <ConsumerReviews />
        <Properties />
        <CriticReviews />
      </LayoutRight>
    </Layout>
  )
}
