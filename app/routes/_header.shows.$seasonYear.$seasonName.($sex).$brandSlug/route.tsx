import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { type SitemapFunction } from 'remix-sitemap'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { type Handle } from 'root'
import { getUserId } from 'session.server'
import { NAME, invert } from 'utils'
import { getScores } from 'utils/scores.server'
import { SEASON_NAME_TO_SLUG } from 'utils/season'
import { SEX_TO_SLUG } from 'utils/sex'
import { getShowKeywords, getShowPath, getShowSchema } from 'utils/show'

import { About } from './about'
import { Looks } from './looks'
import { getReview } from './rate-and-review'

export { action } from './rate-and-review'

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
    return { to: data ? getShowPath(data) : '.', children: data?.name ?? '404' }
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
  const userId = await getUserId(request)
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
        include: {
          images: true,
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

export default function ShowPage() {
  return (
    <main className='fixed inset-0 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5 gap-6'>
      <About className='col-span-3 pl-6 pb-6 pt-16' />
      <Looks className='col-span-2 pr-6 pb-6 pt-16' />
    </main>
  )
}
