import { Location } from '@prisma/client'
import { Link, useLoaderData } from '@remix-run/react'
import { type MetaFunction, type SerializeFrom } from '@vercel/remix'
import { scaleLinear } from 'd3-scale'
import { X } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from 'react-simple-maps'

import { type loader as locationAPI } from 'routes/api.locations.$location'

import { Banner } from 'components/banner'
import { Carousel, type CarouselItemProps } from 'components/carousel'
import { ClientOnly } from 'components/client-only'
import { FilterLink } from 'components/filter-link'
import { LoadingLine } from 'components/loading-line'
import { Button } from 'components/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverTrigger,
  PopoverContent,
} from 'components/ui/popover'

import { cn } from 'utils/cn'
import { NAME, useLoadFetcher } from 'utils/general'
import { LOCATION_TO_NAME, LOCATION_TO_COORDINATES } from 'utils/location'

import { prisma } from 'db.server'

import geography from './geography.json'
import { Header } from './header'

type Count = {
  location: Location | null
  collectionsCount: number
  brandsCount: number
}

export const meta: MetaFunction = () => [
  { title: `DOLCE: The Worldwide Fashion Database | ${NAME}` },
]

export async function loader() {
  // TODO I am currently doing these aggregations in-memory as Prisma does not
  // support the COUNT(DISTINCT()) functionality natively. This will get slower
  // as the number of brands with collections increases.
  // @see {@link https://github.com/prisma/prisma/issues/20629}
  const collections = await prisma.collection.groupBy({
    by: ['location', 'brandId'],
    _count: true,
  })
  const counts = collections.reduce((acc, collection) => {
    const count = acc.find((c) => c.location === collection.location)
    if (count) {
      count.collectionsCount += collection._count
      count.brandsCount += 1
    } else {
      acc.push({
        location: collection.location,
        collectionsCount: collection._count,
        brandsCount: 1,
      })
    }
    return acc
  }, [] as Count[])
  return counts
}

export default function HomePage() {
  return (
    <>
      <Header />
      <Banner>
        Explore the world of fashion. Watch collections, peruse runway looks,
        read critic reviews, save your favorite looks to custom sets, and
        compare purchase options for the products in those looks—we help you
        find the best price across retailers and secondary markets. Products are
        aggregated from across the web and collection prices direct from the
        brand (e.g. Ralph Lauren, Gucci), from third-party retailers (e.g.
        Nordstrom, Neiman Marcus, SSENSE), and from secondary markets (e.g.
        StockX, GOAT, Ebay).
      </Banner>
      <section className='p-6 mt-6 mx-auto max-w-screen-xl w-full'>
        <header className='flex items-center justify-center gap-1.5 sm:gap-2 text-xl sm:text-2xl tracking-tighter'>
          <h1>DOLCE</h1>
          <span aria-hidden>·</span>
          <h2>The Worldwide Fashion Database</h2>
        </header>
        <Map className='w-full' />
      </section>
    </>
  )
}

type Stats = SerializeFrom<typeof loader>[number]

function hasLocation(stats: Stats): stats is Stats & { location: Location } {
  return stats.location != null
}

// The statistic to collection in the map icon sizes.
const stat = 'brandsCount' satisfies keyof Stats

function Map({ className }: { className?: string }) {
  const counts = useLoaderData<typeof loader>()
  const max = counts
    .filter((c) => c.location != null)
    .sort((a, b) => b[stat] - a[stat])?.[0]?.[stat]
  const scale = useMemo(
    () => scaleLinear().domain([0, max]).range([3, 6]),
    [max],
  )
  return (
    <div className={cn('flex justify-center items-center', className)}>
      <ClientOnly>
        <ComposableMap
          className='object-scale-down w-full h-full'
          projectionConfig={{ scale: 147 }}
          width={800}
          height={400}
        >
          <Sphere
            id='sphere'
            fill='transparent'
            stroke='inherit'
            className='stroke-gray-200 dark:stroke-gray-800'
            strokeWidth={0.5}
          />
          <Graticule
            className='stroke-gray-200 dark:stroke-gray-800'
            strokeWidth={0.5}
          />
          <Geographies geography={geography}>
            {({ geographies }) =>
              geographies.map((geo) => (
                /* eslint-disable @typescript-eslint/no-unsafe-assignment */
                <Geography
                  key={(geo as { rsmKey: string }).rsmKey}
                  geography={geo}
                  className='fill-gray-900 dark:fill-gray-100'
                />
                /* eslint-enable @typescript-eslint/no-unsafe-assignment */
              ))
            }
          </Geographies>
          {Object.entries(LOCATION_TO_COORDINATES).map(
            ([location, coordinates]) => {
              const stats = counts.find((c) => c.location === location)
              if (stats == null || !hasLocation(stats)) return null
              const radius = scale(stats[stat])
              return (
                <LocationMarker
                  key={location}
                  stats={stats}
                  radius={radius}
                  coordinates={coordinates}
                />
              )
            },
          )}
        </ComposableMap>
      </ClientOnly>
    </div>
  )
}

// The width of the collection image(s) in the location popover (px).
const itemWidth = 120

// The number of collections to collection per slide in the location popover.
const itemsPerSlide = 4

function LocationMarker({
  stats,
  radius,
  coordinates,
}: {
  stats: Stats & { location: Location }
  radius: number
  coordinates: [number, number]
}) {
  const endpoint = `/api/locations/${stats.location}`
  const fetcher = useLoadFetcher<typeof locationAPI>(endpoint)
  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={fetcher.load}>
        <Marker
          coordinates={coordinates}
          className='fill-teal-500 aria-expanded:fill-rose-500 transition-colors cursor-pointer'
        >
          <circle className='opacity-50' r={radius} />
          <circle r={2} />
          {(fetcher.data ?? [])
            .flatMap((collection) =>
              collection.looks.flatMap((look) => look.images),
            )
            .map((image) => (
              <link key={image.id} rel='preload' as='image' href={image.url} />
            ))}
        </Marker>
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={12}
        className='text-sm p-0 overflow-hidden'
        style={{ width: itemsPerSlide * itemWidth }}
      >
        <Carousel
          items={fetcher.data}
          item={CarouselItem}
          itemsPerSlide={itemsPerSlide}
          loading={fetcher.state === 'loading'}
        >
          <PopoverClose asChild>
            <Button
              variant='transparent'
              className='rounded-full h-5 w-5 pointer-events-auto'
              size='icon'
            >
              <X className='h-3 w-3' />
            </Button>
          </PopoverClose>
        </Carousel>
        {fetcher.state === 'loading' && <LoadingLine className='-mt-px' />}
        <FilterLink
          prefetch='intent'
          filters={[
            {
              id: nanoid(5),
              name: 'location',
              condition: 'equals',
              value: stats.location,
            },
          ]}
          to='/collections'
          className='block py-2 px-3'
        >
          <h2 className='font-semibold'>{LOCATION_TO_NAME[stats.location]}</h2>
          <p className='text-gray-400 dark:text-gray-600'>
            {stats.collectionsCount} collections
            <span aria-hidden> · </span>
            {stats.brandsCount} brands
          </p>
        </FilterLink>
      </PopoverContent>
    </Popover>
  )
}

type Collection = SerializeFrom<typeof locationAPI>[number]

function CarouselItem({
  item: collection,
  index,
}: CarouselItemProps<Collection>) {
  return (
    <div className='w-full aspect-person'>
      {collection && (
        <Link
          to={`/collections/${collection.id}`}
          prefetch='intent'
          className='block w-full h-full'
        >
          <img
            src={collection.looks[0].images[0].url}
            alt=''
            loading={index < itemsPerSlide ? 'eager' : 'lazy'}
            decoding={index < itemsPerSlide ? 'sync' : 'async'}
            className='w-full h-full object-cover'
          />
        </Link>
      )}
    </div>
  )
}
