import { Location } from '@prisma/client'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { scaleLinear } from 'd3-scale'
import { X } from 'lucide-react'
import { useCallback, useRef, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from 'react-simple-maps'

import { type loader as locationAPI } from 'routes/api.locations.$location'

import { Carousel } from 'components/carousel'
import { ClientOnly } from 'components/client-only'
import { LoadingLine } from 'components/loading-line'
import { Button } from 'components/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverTrigger,
  PopoverContent,
} from 'components/ui/popover'

import { cn } from 'utils/cn'
import { LOCATION_TO_NAME, LOCATION_TO_COORDINATES } from 'utils/location'

import { prisma } from 'db.server'

import geography from './geography.json'
import { Header } from './header'

type Count = {
  location: Location | null
  showsCount: number
  brandsCount: number
}

export async function loader() {
  // TODO I am currently doing these aggregations in-memory as Prisma does not
  // support the COUNT(DISTINCT()) functionality natively. This will get slower
  // as the number of brands with shows increases.
  // @see {@link https://github.com/prisma/prisma/issues/20629}
  const shows = await prisma.show.groupBy({
    by: ['location', 'brandId'],
    _count: true,
  })
  const counts = shows.reduce((acc, show) => {
    const count = acc.find((c) => c.location === show.location)
    if (count) {
      count.showsCount += show._count
      count.brandsCount += 1
    } else {
      acc.push({
        location: show.location,
        showsCount: show._count,
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
      <section className='p-6 mt-6 mx-auto max-w-screen-xl w-full'>
        <header className='flex items-center justify-center gap-1.5 sm:gap-2 text-xl sm:text-2xl tracking-tighter'>
          <h1>dolce</h1>
          <span aria-hidden>·</span>
          <h2>the worldwide fashion database</h2>
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

// The statistic to show in the map icon sizes.
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

// The width of the show image(s) in the location popover (px).
const itemWidth = 120

// The number of shows to show per slide in the location popover.
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
  const fetcher = useFetcher<typeof locationAPI>()
  const loaded = useRef('')
  const endpoint = `/api/locations/${stats.location}`
  const load = useCallback(() => {
    if (loaded.current !== endpoint) {
      fetcher.load(endpoint)
      loaded.current = endpoint
    }
  }, [fetcher, endpoint])

  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={load}>
        <Marker
          coordinates={coordinates}
          className='fill-teal-500 aria-expanded:fill-rose-500 transition-colors cursor-pointer'
        >
          <circle className='opacity-50' r={radius} />
          <circle r={2} />
          {(fetcher.data ?? [])
            .flatMap((show) => show.looks.flatMap((look) => look.images))
            .map((image) => (
              <link key={image.id} rel='preload' as='image' href={image.url} />
            ))}
        </Marker>
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={12}
        className='w-auto text-sm p-0 overflow-hidden'
      >
        <Carousel
          items={fetcher.data}
          item={CarouselItem}
          itemWidth={itemWidth}
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
        <article className='py-2 px-3'>
          <h2 className='font-semibold'>{LOCATION_TO_NAME[stats.location]}</h2>
          <p className='text-gray-400 dark:text-gray-600'>
            {stats.showsCount} shows
            <span aria-hidden> · </span>
            {stats.brandsCount} brands
          </p>
        </article>
      </PopoverContent>
    </Popover>
  )
}

type Show = SerializeFrom<typeof locationAPI>[number]

function CarouselItem(show?: Show) {
  if (!show) return <div className='w-full aspect-person' />
  const { id, looks } = show
  return (
    <div className='w-full aspect-person'>
      <Link
        to={`/shows/${id}`}
        prefetch='intent'
        className='block w-full h-full'
      >
        <img
          src={looks[0].images[0].url}
          alt=''
          className='w-full h-full object-cover'
        />
      </Link>
    </div>
  )
}
