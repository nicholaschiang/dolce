import { Location } from '@prisma/client'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { scaleLinear } from 'd3-scale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { type RefObject, useState, useCallback, useRef, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from 'react-simple-maps'

import { type loader as locationAPI } from 'routes/api.locations.$location'

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
  brandIds: number[]
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
      count.brandIds.push(show.brandId)
    } else {
      acc.push({
        location: show.location,
        showsCount: show._count,
        brandIds: [show.brandId],
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

function Map({ className }: { className?: string }) {
  const counts = useLoaderData<typeof loader>()
  const max = counts
    .filter((c) => c.location != null)
    .sort((a, b) => b.showsCount - a.showsCount)?.[0]?.showsCount
  const scale = useMemo(
    () => scaleLinear().domain([0, max]).range([1, 6]),
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
              const radius = scale(stats.showsCount)
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

// The width of the pagination dot.
const dotSize = 6

// The margin between each pagination dot.
const dotMargin = 2

// The number of dots (should be an odd number so there is a center dot).
const maxDots = 5

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
  const items = fetcher.data ?? []
  const loaded = useRef('')
  const endpoint = `/api/locations/${stats.location}`
  const load = useCallback(() => {
    if (loaded.current !== endpoint) {
      fetcher.load(endpoint)
      loaded.current = endpoint
    }
  }, [fetcher, endpoint])

  const [index, setIndex] = useState(0)
  const carouselRef = useRef<HTMLUListElement>(null)

  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={load}>
        <Marker
          coordinates={coordinates}
          className='fill-teal-500 aria-expanded:fill-rose-500 transition-colors'
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
        <div className='relative group'>
          <ul
            className={cn(
              'flex overflow-auto snap-x bg-gray-100 dark:bg-gray-900',
              !fetcher.data && fetcher.state === 'loading' && 'animate-pulse',
            )}
            style={{ width: itemWidth * itemsPerSlide }}
            ref={carouselRef}
            onScroll={() => {
              if (carouselRef.current) {
                const nextIndex = carouselRef.current.scrollLeft / itemWidth
                setIndex(Math.round(nextIndex))
              }
            }}
          >
            {items.length === 0 && (
              <li
                className='aspect-person flex-none'
                style={{ width: itemWidth }}
              />
            )}
            {items.map((show) => (
              <li
                key={show.id}
                style={{ width: itemWidth }}
                className='aspect-person flex-none snap-start'
              >
                <Link
                  to={`/shows/${show.id}`}
                  prefetch='intent'
                  className='block w-full h-full'
                >
                  <img
                    src={show.looks[0].images[0].url}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              'absolute inset-0 flex flex-col p-3 pointer-events-none',
              items.length > 0 &&
                'bg-gradient-to-b from-transparent from-80% to-black/25',
            )}
          >
            <div className='flex-1 flex justify-between items-start'>
              <PopoverClose asChild>
                <Button
                  variant='transparent'
                  className='rounded-full h-5 w-5 pointer-events-auto'
                  size='icon'
                >
                  <X className='h-3 w-3' />
                </Button>
              </PopoverClose>
            </div>
            {items.length > 0 && (
              <>
                <PaginationButtons
                  index={index}
                  numOfItems={items.length}
                  carouselRef={carouselRef}
                />
                <Dots index={index} numOfItems={items.length} />
              </>
            )}
          </div>
        </div>
        {fetcher.state === 'loading' && <LoadingLine className='-mt-px' />}
        <article className='py-2 px-3'>
          <h2 className='font-semibold'>{LOCATION_TO_NAME[stats.location]}</h2>
          <p className='text-gray-400 dark:text-gray-600'>
            {stats.showsCount} shows
            <span aria-hidden> · </span>
            {stats.brandIds.length} brands
          </p>
        </article>
      </PopoverContent>
    </Popover>
  )
}

function PaginationButtons({
  index,
  numOfItems,
  carouselRef,
}: {
  index: number
  numOfItems: number
  carouselRef: RefObject<HTMLElement | null>
}) {
  const minScroll = 0
  const maxScroll = Math.max(
    (numOfItems - itemsPerSlide) * itemWidth,
    minScroll,
  )
  return (
    <div className='flex-1 flex justify-between items-center opacity-0 transition-opacity group-hover:opacity-100 duration-300'>
      <Button
        size='icon'
        variant='outline'
        className={cn(
          'rounded-full group-hover:pointer-events-auto opacity-100 duration-200 transition-all',
          index === 0 && 'opacity-0 pointer-events-none scale-50',
        )}
        onClick={() => {
          if (carouselRef.current) {
            const nextIndex = Math.max(index - 1, 0)
            const left = Math.max(nextIndex * itemWidth, minScroll)
            carouselRef.current.scrollTo({
              left,
              behavior: 'smooth',
            })
          }
        }}
      >
        <ChevronLeft className='h-3 w-3' />
      </Button>
      <Button
        size='icon'
        variant='outline'
        className={cn(
          'rounded-full group-hover:pointer-events-auto opacity-100 duration-200 transition-all',
          index === numOfItems - itemsPerSlide &&
            'opacity-0 pointer-events-none scale-50',
        )}
        onClick={() => {
          if (carouselRef.current) {
            const nextIndex = Math.min(index + 1, numOfItems - 1)
            const left = Math.min(nextIndex * itemWidth, maxScroll)
            carouselRef.current.scrollTo({
              left,
              behavior: 'smooth',
            })
          }
        }}
      >
        <ChevronRight className='h-3 w-3' />
      </Button>
    </div>
  )
}

function Dots({ index, numOfItems }: { index: number; numOfItems: number }) {
  // The entire dot width is the dot size + dot margin.
  const dotWidth = dotSize + dotMargin * 2

  // Show a dot for every slide. Each slide has X items and scrolls by one item
  // at a time. Thus, users can scroll items.length - X + 1 times.
  const numOfDots = numOfItems - itemsPerSlide + 1

  // Move the dots so that the active one is always in the center.
  const center = Math.floor((maxDots - 1) / 2)
  const transform = Math.max(0, Math.min(index - center, numOfDots - maxDots))

  // The index of the left-most visible dot.
  const left = transform

  // The index of the right-most visible dot.
  const right = left + maxDots - 1

  return (
    <div className='flex-1 flex justify-center items-end'>
      <div
        className='flex overflow-clip'
        style={{ maxWidth: dotWidth * maxDots }}
      >
        <div
          className='flex transition-transform duration-200'
          style={{
            transform: `translateX(-${transform * dotWidth}px)`,
          }}
        >
          {Array(numOfDots)
            .fill(null)
            .map((_, idx) => {
              return (
                <span
                  key={idx}
                  className={cn(
                    'flex-none rounded-full bg-white transition-all opacity-50 duration-200',
                    idx === index && 'opacity-100',
                    transform > 0 && idx <= left && 'scale-[.66]',
                    transform > 0 && idx === left + 1 && 'scale-[.83]',
                    transform < numOfDots - maxDots &&
                      idx === right - 1 &&
                      'scale-[.83]',
                    transform < numOfDots - maxDots &&
                      idx >= right &&
                      'scale-[.66]',
                  )}
                  style={{
                    width: dotSize,
                    height: dotSize,
                    marginLeft: dotMargin,
                    marginRight: dotMargin,
                  }}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}
