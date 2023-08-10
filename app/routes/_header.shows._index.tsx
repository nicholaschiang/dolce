import {
  Link,
  useNavigation,
  useLoaderData,
  useSearchParams,
  useBeforeUnload,
} from '@remix-run/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { type LoaderArgs, type V2_MetaFunction } from '@vercel/remix'
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react'
import { type Metric } from 'web-vitals'

import { Empty } from 'components/empty'
import { Image } from 'components/image'

import { cn } from 'utils/cn'
import { NAME } from 'utils/general'
import { getShowSeason, getShowPath } from 'utils/show'

import { prisma } from 'db.server'
import { log } from 'log.server'

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

// Load shows in pages of 100 (each page has 100 shows).
const defaultTake = 200

// Pre-load the next page of shows on scroll.
const overscan = 40

const getStartLimit = (searchParams: URLSearchParams) => ({
  skip: Number(searchParams.get('skip') || '0'),
  take: Number(searchParams.get('take') || defaultTake.toString()),
})

export async function loader({ request }: LoaderArgs) {
  log.debug('getting shows...')
  const [shows, count] = await Promise.all([
    prisma.show.findMany({
      ...getStartLimit(new URL(request.url).searchParams),
      include: {
        season: true,
        brand: true,
        collections: true,
        looks: {
          include: { images: { take: 1 } },
          orderBy: { number: 'asc' },
          take: 1,
        },
      },
      orderBy: [
        { brand: { name: 'asc' } },
        { season: { year: 'desc' } },
        { season: { name: 'asc' } },
        { level: 'asc' },
        { sex: 'asc' },
      ],
    }),
    prisma.show.count(),
  ])
  log.debug('got %d shows', shows.length)
  return { shows, count }
}

// Eagerly load images for the first two rows of shows (above the fold).
const rowsToEagerLoad = 2

// How many shows are shown in each row of results.
const showsPerRow = 5

// The height of each row (480px for item + 40px for margin).
const rowHeight = 520

// Do not attempt to run layout effects server-side.
const isServerRender = typeof document === 'undefined'
const useSSRLayoutEffect = isServerRender ? () => {} : useLayoutEffect

export default function ShowsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skip, take } = getStartLimit(searchParams)
  const { shows, count } = useLoaderData<typeof loader>()

  // Infinite scroll the shows grid list.
  const parentRef = useRef<HTMLElement>(null)
  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    lanes: showsPerRow,
    overscan: 10,
  })

  // Save the user's scroll position and restore it upon revisiting the page.
  const navigation = useNavigation()
  useEffect(() => {
    if (navigation.location && parentRef.current)
      sessionStorage.setItem(
        'infiniteScrollTop',
        parentRef.current.scrollTop.toString(),
      )
  }, [navigation])
  useBeforeUnload(
    useCallback(() => {
      if (parentRef.current)
        sessionStorage.setItem(
          'infiniteScrollTop',
          parentRef.current.scrollTop.toString(),
        )
    }, []),
  )
  useSSRLayoutEffect(() => {
    const infiniteScrollTop = sessionStorage.getItem('infiniteScrollTop')
    if (parentRef.current && infiniteScrollTop)
      parentRef.current.scrollTop = Number(infiniteScrollTop)
  }, [])

  // Load the results necessary to show the current window of data.
  const lowerBoundary = skip + overscan
  const upperBoundary = skip + take - overscan
  const middleCount = Math.ceil(take / 2)

  const [firstVirtualItem] = rowVirtualizer.getVirtualItems()
  const [lastVirtualItem] = [...rowVirtualizer.getVirtualItems()].reverse()
  if (!firstVirtualItem || !lastVirtualItem)
    throw new Error('this should never happen')

  let neededSkip = skip

  if (firstVirtualItem.index < lowerBoundary) {
    // User is scrolling up. Move the window up.
    neededSkip =
      Math.floor((firstVirtualItem.index - middleCount) / overscan) * overscan
  } else if (lastVirtualItem.index > upperBoundary) {
    // User is scrolling down. Move the window down.
    neededSkip =
      Math.ceil((lastVirtualItem.index - middleCount) / overscan) * overscan
  }

  // Can't go above our data count.
  if (neededSkip + take > count) neededSkip = count - take

  // Can't go below zero.
  if (neededSkip < 0) neededSkip = 0

  const isMountedRef = useRef(false)
  useEffect(() => {
    // We use a `setTimeout` here to avoid DOM exceptions when a user is
    // scrolling too quickly and there are too many navigate calls.
    if (isMountedRef.current && neededSkip !== skip) {
      const timeoutId = setTimeout(() => {
        setSearchParams(
          { skip: String(neededSkip), take: defaultTake.toString() },
          { replace: true },
        )
      }, 100)
      // This cleanup function is needed in strict mode to prevent an
      // unnecessary update to the search params `skip`. In strict mode, React
      // runs effects twice. The first time the effect runs, the virtualizer
      // hasn't measured the DOM yet and the `firstVirtualItem.index` is `0`.
      // The second (correct) time it runs, the virtualizer will have measured
      // the DOM and the index will be correctly set.
      // @see {@link https://react.dev/learn/synchronizing-with-effects}
      return () => clearTimeout(timeoutId)
    }
  }, [skip, neededSkip, setSearchParams])
  useEffect(() => {
    isMountedRef.current = true
  }, [])

  const [metric, setMetric] = useState<Metric>()
  useEffect(() => {
    setMetric(window.metrics?.find((m) => m.name === 'TTFB'))
  }, [])

  return (
    <main
      ref={parentRef}
      className='fixed inset-x-0 top-10 bottom-0 overflow-auto'
    >
      <div className='px-6 pb-6 mx-auto max-w-screen-xl'>
        <h1 className='text-lg mt-2 mb-8 h-7 lowercase tracking-tighter'>
          {count.toLocaleString()} shows{' '}
          {metric && (
            <span className='text-gray-400 dark:text-gray-600 animate-fade-in'>
              ({Math.ceil(metric.value / 10) / 100} seconds)
            </span>
          )}
        </h1>
        {shows.length > 0 ? (
          <ol
            className='-m-1'
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const index = isMountedRef.current
                ? Math.abs(skip - virtualRow.index)
                : virtualRow.index
              const show = shows[index]
              return (
                <li
                  data-id={show?.id}
                  data-index={index}
                  data-virtual-index={virtualRow.index}
                  key={virtualRow.key}
                  className={cn('p-1', show == null && 'cursor-wait')}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(virtualRow.lane / showsPerRow) * 100}%`,
                    width: `${(1 / showsPerRow) * 100}%`,
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Link
                    to={show ? getShowPath(show) : ''}
                    prefetch='intent'
                    className='block'
                  >
                    <div
                      className={cn(
                        'bg-gray-100 dark:bg-gray-900 aspect-person mb-3',
                        show == null && 'animate-pulse',
                      )}
                    >
                      {show != null &&
                        show.looks.length > 0 &&
                        show.looks[0].images.length > 0 && (
                          <Image
                            className='object-cover h-full w-full'
                            loading={
                              virtualRow.index < showsPerRow * rowsToEagerLoad
                                ? 'eager'
                                : 'lazy'
                            }
                            decoding={
                              virtualRow.index < showsPerRow * rowsToEagerLoad
                                ? 'sync'
                                : 'async'
                            }
                            src={show.looks[0].images[0].url}
                            responsive={[
                              100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
                            ].map((width) => ({
                              size: { width },
                              maxWidth: width * showsPerRow,
                            }))}
                          />
                        )}
                    </div>
                    <h2 className='text-xl font-serif font-semibold text-center leading-none mb-1'>
                      {show?.brand.name}
                    </h2>
                    <h3 className='text-xs uppercase text-center'>
                      {show ? getShowSeason(show) : ''}
                    </h3>
                  </Link>
                </li>
              )
            })}
          </ol>
        ) : (
          <Empty>
            There are no fashion shows to show yet. Please come again later.
          </Empty>
        )}
      </div>
    </main>
  )
}
