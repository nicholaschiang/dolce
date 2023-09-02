import {
  useNavigation,
  useSearchParams,
  useBeforeUnload,
} from '@remix-run/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  type RefObject,
  type Dispatch,
  type SetStateAction,
  type FC,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'

import { Empty } from 'components/empty'

import { cn } from 'utils/cn'
import { useLayoutEffect } from 'utils/general'

// Load shows in pages of 100 (each page has 100 shows).
const defaultTake = 100

// Pre-load the next page of shows on scroll.
const overscan = 10

// Get the Prisma skip and take from the URL search params.
export const getPagination = (searchParams: URLSearchParams) => ({
  skip: Number(searchParams.get('skip') || '0'),
  take: Number(searchParams.get('take') || defaultTake.toString()),
})

export type InfiniteListItemProps<T> = { item?: T }
type InfiniteListContentProps<T> = {
  parentRef: RefObject<HTMLElement>
  sessionStorageKey: string
  items: T[]
  item: FC<InfiniteListItemProps<T>>
  itemAspectRatio: number
  itemCount: number
  itemsPerRow: number
  setItemsPerRow: Dispatch<SetStateAction<number>>
}
export type InfiniteListProps<T> = Omit<
  InfiniteListContentProps<T>,
  'parentRef'
> & {
  emptyMessage?: string
  className?: string
}

// The horizontal padding between the grid and the viewport.
const padding = 24

// The min width of a single item.
const minItemWidth = 240

// The margin between each show item.
const itemMargin = 8

export function InfiniteList<T>({
  emptyMessage,
  itemCount,
  className,
  ...etc
}: InfiniteListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={parentRef}
      style={{ padding }}
      className={cn('overflow-y-auto overflow-x-hidden', className)}
    >
      {itemCount > 0 ? (
        <InfiniteListContent
          parentRef={parentRef}
          itemCount={itemCount}
          {...etc}
        />
      ) : (
        <Empty>{emptyMessage}</Empty>
      )}
    </div>
  )
}

function InfiniteListContent<T>({
  parentRef,
  sessionStorageKey,
  items,
  item: Item,
  itemAspectRatio,
  itemCount,
  itemsPerRow,
  setItemsPerRow,
}: InfiniteListContentProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skip, take } = getPagination(searchParams)

  // The total width of the grid.
  const [totalWidth, setTotalWidth] = useState(0)

  // The height of each row (480px for item + 40px for margin).
  const itemWidth = totalWidth / itemsPerRow

  // Derive the item height from width (9:16 image + 50px text + 40px margin).
  const itemHeight = itemWidth / itemAspectRatio + 50 + 40

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
    count: itemCount,
  })
  useEffect(() => virtualizer.measure(), [itemsPerRow, virtualizer])

  // Save the user's scroll position and restore it upon revisiting the page.
  const navigation = useNavigation()
  useEffect(() => {
    if (navigation.location && parentRef.current)
      sessionStorage.setItem(
        sessionStorageKey,
        parentRef.current.scrollTop.toString(),
      )
  }, [sessionStorageKey, navigation, parentRef])
  useBeforeUnload(
    useCallback(() => {
      if (parentRef.current)
        sessionStorage.setItem(
          sessionStorageKey,
          parentRef.current.scrollTop.toString(),
        )
    }, [sessionStorageKey, parentRef]),
  )
  useLayoutEffect(() => {
    const infiniteScrollTop = sessionStorage.getItem(sessionStorageKey)
    if (totalWidth && parentRef.current && infiniteScrollTop)
      parentRef.current.scrollTo({ top: Number(infiniteScrollTop) })
  }, [sessionStorageKey, parentRef, totalWidth])

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
  if (neededSkip + take > itemCount) neededSkip = itemCount - take

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

  return (
    <ol
      style={{
        visibility: totalWidth ? 'visible' : 'hidden',
        height: `${virtualizer.getTotalSize()}px`,
        margin: `-${itemMargin}px`,
        position: 'relative',
      }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const index = isMountedRef.current
          ? Math.abs(skip - virtualRow.index)
          : virtualRow.index
        const item = items[index]
        return (
          <li
            data-index={virtualRow.index}
            key={virtualRow.key}
            className={cn(item == null && 'cursor-wait')}
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
            <Item item={item} />
          </li>
        )
      })}
    </ol>
  )
}
