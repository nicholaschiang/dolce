import { useLoaderData } from '@remix-run/react'
import {
  type SerializeFrom,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@vercel/remix'
import { useState } from 'react'

import { Banner } from 'components/banner'
import { Carousel, type CarouselItemProps } from 'components/carousel'
import { FiltersBar, getWhere } from 'components/filters-bar'
import {
  getPagination,
  InfiniteList,
  type InfiniteListItemProps,
} from 'components/infinite-list'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemSubtitle,
  ItemDescription,
} from 'components/item'

import { NAME } from 'utils/general'
import { LOCATION_TO_NAME } from 'utils/location'
import { getShowSeason, getShowPath } from 'utils/show'

import { prisma } from 'db.server'
import { type ShowFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const handle: Handle = {
  breadcrumb: () => ({ to: '/shows', children: 'shows' }),
}

export const meta: V2_MetaFunction = () => [
  {
    title: `Fashion Shows: Fashion Week, Runway, Designer Collections | ${NAME}`,
  },
  {
    name: 'description',
    content:
      'Get up-to-the-minute fashion show coverage at New York, London, ' +
      'Milan, and Paris Fashion Weeks. See photos, videos, reviews, and more.',
  },
]

export async function loader({ request }: LoaderArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting shows... %s', string)
  const [shows, filteredCount, totalCount] = await Promise.all([
    prisma.show.findMany({
      ...getPagination(new URL(request.url).searchParams),
      include: {
        season: true,
        brand: true,
        looks: {
          include: { images: { take: 1 } },
          orderBy: { number: 'asc' },
        },
      },
      orderBy: [
        { brand: { name: 'asc' } },
        { season: { year: 'desc' } },
        { season: { name: 'asc' } },
        { level: 'asc' },
        { sex: 'asc' },
      ],
      where,
    }),
    prisma.show.count({ where }),
    prisma.show.count(),
  ])
  log.debug('got %d shows of %d/%d', shows.length, filteredCount, totalCount)
  return { shows, filteredCount, totalCount }
}

// The number of rows to display when at max width.
const itemsPerRowDefault = 5

// Don't allow users to filter on back-end only fields.
const hiddenFields: ShowFilterName[] = [
  'collections',
  'articles',
  'looks',
  'reviews',
  'videoId',
  'brandId',
  'seasonId',
]

export default function ShowsPage() {
  const [itemsPerRow, setItemsPerRow] = useState(itemsPerRowDefault)
  const { shows, filteredCount, totalCount } = useLoaderData<typeof loader>()
  return (
    <>
      <Banner>
        Explore the world of fashion. Watch shows, peruse runway looks, read
        critic reviews, save your favorite looks to custom sets, and compare
        purchase options for the products in those looks—we help you find the
        best price across retailers (e.g. SSENSE, Neiman Marcus) and secondary
        markets (e.g. StockX, GOAT). You can add filters (by clicking the “+”
        button below or by typing “f”) to refine your results by a specific
        season (e.g. Fall 2023), brand (e.g. Louis Vuitton, Brunello Cucinelli),
        location (e.g. Tokyo, Paris), and many more show attributes.
      </Banner>
      <FiltersBar
        modelName='Show'
        hiddenFields={hiddenFields}
        zoom={itemsPerRow}
        setZoom={setItemsPerRow}
        maxZoom={7}
        minZoom={1}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      <InfiniteList
        items={shows}
        item={ShowItem}
        itemAspectRatio={9 / 16}
        itemCount={filteredCount}
        itemsPerRow={itemsPerRow}
        setItemsPerRow={setItemsPerRow}
        sessionStorageKey='shows'
        emptyMessage='There are no fashion shows that match your filters.'
        className='h-0 grow'
      />
    </>
  )
}

type Show = SerializeFrom<typeof loader>['shows'][number]

function ShowItem({ item: show }: InfiniteListItemProps<Show>) {
  return (
    <Item to={show ? getShowPath(show) : ''}>
      <Carousel
        loading={show == null}
        items={show?.looks}
        item={ShowLookItem}
      />
      {show && (
        <ItemContent>
          <ItemTitle>{show.brand.name}</ItemTitle>
          <ItemSubtitle>{getShowSeason(show)}</ItemSubtitle>
          {show?.location && (
            <ItemDescription>{LOCATION_TO_NAME[show.location]}</ItemDescription>
          )}
        </ItemContent>
      )}
    </Item>
  )
}

type Look = Show['looks'][number]

function ShowLookItem({ item: look, index }: CarouselItemProps<Look>) {
  return (
    <div className='w-full aspect-person'>
      {look && (
        <img
          className='object-cover h-full w-full'
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding={index === 0 ? 'sync' : 'async'}
          src={look.images[0].url}
          alt=''
        />
      )}
    </div>
  )
}
