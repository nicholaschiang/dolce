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

import { getCollectionSeason, getCollectionPath } from 'utils/collection'
import { NAME, PERSON_ASPECT_RATIO } from 'utils/general'
import { LOCATION_TO_NAME } from 'utils/location'

import { prisma } from 'db.server'
import { type CollectionFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const handle: Handle = {
  breadcrumb: () => ({ to: '/collections', children: 'collections' }),
}

export const meta: MetaFunction = () => [
  {
    title: `Fashion Collections: Fashion Week, Runway, Designer Collections | ${NAME}`,
  },
  {
    name: 'description',
    content:
      'Get up-to-the-minute fashion collection coverage at New York, London, ' +
      'Milan, and Paris Fashion Weeks. See photos, videos, reviews, and more.',
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting collections... %s', string)
  const [collections, filteredCount, totalCount] = await Promise.all([
    prisma.collection.findMany({
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
    prisma.collection.count({ where }),
    prisma.collection.count(),
  ])
  log.debug(
    'got %d collections of %d/%d',
    collections.length,
    filteredCount,
    totalCount,
  )
  return { collections, filteredCount, totalCount }
}

// The numberof rows to display when at max width.
const itemsPerRowDefault = 5

// Don't allow users to filter on back-end only fields.
const hiddenFields: CollectionFilterName[] = [
  'articles',
  'looks',
  'links',
  'reviews',
  'brandId',
  'seasonId',
  'products',
  'shows',
]

export default function CollectionsPage() {
  const [itemsPerRow, setItemsPerRow] = useState(itemsPerRowDefault)
  const { collections, filteredCount, totalCount } =
    useLoaderData<typeof loader>()
  return (
    <>
      <FiltersBar
        modelName='Collection'
        hiddenFields={hiddenFields}
        zoom={itemsPerRow}
        setZoom={setItemsPerRow}
        maxZoom={7}
        minZoom={1}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      <InfiniteList
        items={collections}
        item={CollectionItem}
        itemAspectRatio={PERSON_ASPECT_RATIO}
        itemCount={filteredCount}
        itemsPerRow={itemsPerRow}
        setItemsPerRow={setItemsPerRow}
        sessionStorageKey='collections'
        emptyMessage='There are no fashion collections that match your filters.'
        className='h-0 grow'
      />
    </>
  )
}

type Collection = SerializeFrom<typeof loader>['collections'][number]

function CollectionItem({
  item: collection,
}: InfiniteListItemProps<Collection>) {
  return (
    <Item to={collection ? getCollectionPath(collection) : ''}>
      <Carousel
        loading={collection == null}
        items={collection?.looks}
        item={CollectionLookItem}
      />
      {collection && (
        <ItemContent>
          <ItemTitle>{collection.brand.name}</ItemTitle>
          <ItemSubtitle>{getCollectionSeason(collection)}</ItemSubtitle>
          {collection?.location && (
            <ItemDescription>
              {LOCATION_TO_NAME[collection.location]}
            </ItemDescription>
          )}
        </ItemContent>
      )}
    </Item>
  )
}

type Look = Collection['looks'][number]

function CollectionLookItem({ item: look, index }: CarouselItemProps<Look>) {
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
