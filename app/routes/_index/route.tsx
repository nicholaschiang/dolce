import { Location } from '@prisma/client'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { scaleLinear } from 'd3-scale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState, useCallback, useRef, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from 'react-simple-maps'

import { type loader as locationAPI } from 'routes/api.locations.$location'

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
      <Map />
    </>
  )
}

type Stats = SerializeFrom<typeof loader>[number]

function hasLocation(stats: Stats): stats is Stats & { location: Location } {
  return stats.location != null
}

function Map() {
  const counts = useLoaderData<typeof loader>()
  const max = counts
    .filter((c) => c.location != null)
    .sort((a, b) => b.showsCount - a.showsCount)?.[0]?.showsCount
  const scale = useMemo(
    () => scaleLinear().domain([0, max]).range([1, 6]),
    [max],
  )
  return (
    <div className='fixed inset-0 flex justify-center items-center p-6'>
      <ComposableMap
        className='object-scale-down max-w-full max-h-full'
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
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
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className='fill-gray-900 dark:fill-gray-100'
              />
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
    </div>
  )
}

// The width of the show image(s) in the location popover (px).
const showWidth = 96

// The number of shows to show per slide in the location popover.
const showsPerSlide = 3

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
  const location = LOCATION_TO_NAME[stats.location]
  const carouselRef = useRef<HTMLUListElement>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const minScroll = 0
  let maxScroll = ((fetcher.data?.length ?? 0) - showsPerSlide) * showWidth
  if (maxScroll < minScroll) maxScroll = minScroll
  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={load}>
        <Marker
          coordinates={coordinates}
          className='fill-teal-500 aria-expanded:fill-sky-500 transition-colors'
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
      <PopoverContent className='w-auto text-sm p-0 overflow-hidden'>
        <div className='relative group'>
          <ul
            className={cn(
              'flex overflow-auto snap-x bg-gray-100 dark:bg-gray-900',
              !fetcher.data && fetcher.state === 'loading' && 'animate-pulse',
            )}
            style={{ width: showWidth * showsPerSlide }}
            ref={carouselRef}
          >
            {!fetcher.data?.length && (
              <li
                className='aspect-person flex-none'
                style={{ width: showWidth }}
              />
            )}
            {fetcher.data?.map((show) => (
              <li
                key={show.id}
                style={{ width: showWidth }}
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
          <div className='absolute inset-0 flex flex-col p-3 pointer-events-none'>
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
            <div className='flex-1 flex justify-between items-center opacity-0 transition-opacity group-hover:opacity-100 duration-300'>
              <Button
                size='icon'
                variant='outline'
                className={cn(
                  'rounded-full group-hover:pointer-events-auto',
                  scrollLeft === minScroll && 'opacity-0 pointer-events-none',
                )}
                onClick={() => {
                  if (carouselRef.current != null) {
                    let left = carouselRef.current.scrollLeft - showWidth
                    if (left < minScroll) left = minScroll
                    carouselRef.current.scrollTo({ left, behavior: 'smooth' })
                    setScrollLeft(left)
                  }
                }}
              >
                <ChevronLeft className='h-3 w-3' />
              </Button>
              <Button
                size='icon'
                variant='outline'
                className={cn(
                  'rounded-full group-hover:pointer-events-auto',
                  scrollLeft === maxScroll && 'opacity-0 pointer-events-none',
                )}
                onClick={() => {
                  if (carouselRef.current != null) {
                    let left = carouselRef.current.scrollLeft + showWidth
                    if (left > maxScroll) left = maxScroll
                    carouselRef.current.scrollTo({ left, behavior: 'smooth' })
                    setScrollLeft(left)
                  }
                }}
              >
                <ChevronRight className='h-3 w-3' />
              </Button>
            </div>
            <div className='flex-1 flex justify-center items-end' />
          </div>
        </div>
        {fetcher.state === 'loading' && <LoadingLine className='-mt-px' />}
        <article className='py-2 px-3'>
          <h2 className='font-semibold'>{location}</h2>
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
