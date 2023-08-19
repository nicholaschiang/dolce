import {
  Link,
  useNavigation,
  useLoaderData,
  useSearchParams,
  useBeforeUnload,
} from '@remix-run/react'
import { type VirtualItem, useVirtualizer } from '@tanstack/react-virtual'
import {
  type SerializeFrom,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@vercel/remix'
import {
  type RefObject,
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { type Metric } from 'web-vitals'

import { Carousel, type CarouselItemProps } from 'components/carousel'
import { Empty } from 'components/empty'
import { FiltersBar, getWhere } from 'components/filters-bar'

import { cn } from 'utils/cn'
import { NAME, useLayoutEffect } from 'utils/general'
import { getShowSeason, getShowPath } from 'utils/show'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM } from 'filters'
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
const defaultTake = 100

// Pre-load the next page of shows on scroll.
const overscan = 10

const getStartLimit = (searchParams: URLSearchParams) => ({
  skip: Number(searchParams.get('skip') || '0'),
  take: Number(searchParams.get('take') || defaultTake.toString()),
})

export async function loader({ request }: LoaderArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting shows... %s', string)
  const [shows, filteredCount, totalCount] = await Promise.all([
    prisma.show.findMany({
      ...getStartLimit(new URL(request.url).searchParams),
      include: {
        season: true,
        brand: true,
        collections: true,
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

// The min width of a single show.
const minItemWidth = 240

// The horizontal padding between the grid and the viewport.
const padding = 24

// The margin between each show item.
const itemMargin = 8

// Derive the item height from width (9:16 image + 50px text + 40px margin).
function getItemHeight(itemWidth: number) {
  return (itemWidth * 16) / 9 + 50 + 40
}

export default function ShowsPage() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [itemsPerRow, setItemsPerRow] = useState(itemsPerRowDefault)
  const { filteredCount, totalCount } = useLoaderData<typeof loader>()
  return (
    <>
      <FiltersBar
        modelName='Show'
        zoom={itemsPerRow}
        setZoom={setItemsPerRow}
        maxZoom={7}
        minZoom={1}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      <div
        ref={parentRef}
        style={{ padding }}
        className='h-0 grow overflow-y-auto overflow-x-hidden'
      >
        <InfiniteList
          parentRef={parentRef}
          itemsPerRow={itemsPerRow}
          setItemsPerRow={setItemsPerRow}
        />
      </div>
    </>
  )
}

function InfiniteList({
  parentRef,
  itemsPerRow,
  setItemsPerRow,
}: {
  parentRef: RefObject<HTMLElement>
  itemsPerRow: number
  setItemsPerRow: Dispatch<SetStateAction<number>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skip, take } = getStartLimit(searchParams)
  const { shows, filteredCount } = useLoaderData<typeof loader>()

  // The total width of the grid.
  const [totalWidth, setTotalWidth] = useState(0)

  // The height of each row (480px for item + 40px for margin).
  const itemWidth = totalWidth / itemsPerRow
  const itemHeight = getItemHeight(itemWidth)

  // On window resize, recalculate the item width and number of shows per row.
  useLayoutEffect(() => {
    const handleResize = () => {
      const newTotalWidth = window.innerWidth - padding * 2
      setTotalWidth(newTotalWidth)
      setItemsPerRow(Math.floor(newTotalWidth / minItemWidth))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setItemsPerRow])

  // Infinite scroll the shows grid list.
  const virtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    lanes: itemsPerRow,
    overscan: 10,
    count: filteredCount,
  })
  useEffect(() => virtualizer.measure(), [itemsPerRow, virtualizer])

  // Save the user's scroll position and restore it upon revisiting the page.
  const navigation = useNavigation()
  useEffect(() => {
    if (navigation.location && parentRef.current)
      sessionStorage.setItem(
        'infiniteScrollTop',
        parentRef.current.scrollTop.toString(),
      )
  }, [navigation, parentRef])
  useBeforeUnload(
    useCallback(() => {
      if (parentRef.current)
        sessionStorage.setItem(
          'infiniteScrollTop',
          parentRef.current.scrollTop.toString(),
        )
    }, [parentRef]),
  )
  useLayoutEffect(() => {
    const infiniteScrollTop = sessionStorage.getItem('infiniteScrollTop')
    if (parentRef.current && infiniteScrollTop)
      parentRef.current.scrollTo({ top: Number(infiniteScrollTop) })
  }, [parentRef])

  // Load the results necessary to show the current window of data.
  const lowerBoundary = skip + overscan
  const upperBoundary = skip + take - overscan
  const middleCount = Math.ceil(take / 2)

  const [firstVirtualItem] = virtualizer.getVirtualItems()
  const [lastVirtualItem] = [...virtualizer.getVirtualItems()].reverse()
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
  if (neededSkip + take > filteredCount) neededSkip = filteredCount - take

  // Can't go below zero.
  if (neededSkip < 0) neededSkip = 0

  const isMountedRef = useRef(false)
  useEffect(() => {
    // We use a `setTimeout` here to avoid DOM exceptions when a user is
    // scrolling too quickly and there are too many navigate calls.
    if (isMountedRef.current && neededSkip !== skip) {
      const timeoutId = setTimeout(() => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            next.set('skip', neededSkip.toString())
            next.set('take', defaultTake.toString())
            return next
          },
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

  return shows.length > 0 ? (
    <ol
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        margin: `-${itemMargin}px`,
        position: 'relative',
      }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const index = isMountedRef.current
          ? Math.abs(skip - virtualRow.index)
          : virtualRow.index
        const show = shows[index]
        return (
          <ShowItem
            show={show}
            itemsPerRow={itemsPerRow}
            itemWidth={itemWidth}
            virtualRow={virtualRow}
            key={virtualRow.key}
          />
        )
      })}
    </ol>
  ) : (
    <Empty>
      There are no fashion shows to show yet. Please come again later.
    </Empty>
  )
}

type Show = SerializeFrom<typeof loader>['shows'][number]
type ShowItemProps = {
  show?: Show
  virtualRow: VirtualItem
  itemsPerRow: number
  itemWidth: number
}

function ShowItem({ show, virtualRow, itemsPerRow, itemWidth }: ShowItemProps) {
  return (
    <li
      data-id={show?.id}
      data-index={virtualRow.index}
      key={virtualRow.key}
      className={cn('overflow-hidden', show == null && 'cursor-wait')}
      style={{
        position: 'absolute',
        top: 0,
        left: `${(virtualRow.lane / itemsPerRow) * 100}%`,
        width: `${itemWidth}px`,
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
        padding: `${itemMargin / 2}px`,
      }}
    >
      <Link
        to={show ? getShowPath(show) : ''}
        prefetch='intent'
        className='block'
      >
        <Carousel
          className='mb-3'
          loading={show == null}
          items={show?.looks}
          item={ShowLookItem}
          itemWidth={itemWidth - itemMargin}
          itemsPerSlide={1}
        />
        <h2 className='text-xl font-serif font-semibold text-center leading-none mb-1'>
          {show?.brand.name}
        </h2>
        <h3 className='text-xs uppercase text-center'>
          {show ? getShowSeason(show) : ''}
        </h3>
      </Link>
    </li>
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
