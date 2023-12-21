import { useLoaderData } from '@remix-run/react'
import {
  type SerializeFrom,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@vercel/remix'
import { useState } from 'react'

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

import { NAME, PERSON_ASPECT_RATIO } from 'utils/general'
import { LOCATION_TO_NAME } from 'utils/location'
import { getShowSeason, getShowPath } from 'utils/show'

import { prisma } from 'db.server'
import { type ShowFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const handle: Handle = {
  breadcrumb: () => ({ to: '/shows', children: 'shows' }),
}

export const meta: MetaFunction = () => [
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

export async function loader({ request }: LoaderFunctionArgs) {
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
        itemAspectRatio={PERSON_ASPECT_RATIO}
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
