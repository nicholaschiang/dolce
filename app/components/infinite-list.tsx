import {
  useNavigation,
  useSearchParams,
  useBeforeUnload,
} from '@remix-run/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import useMeasure from 'react-use-measure'

import { Empty } from 'components/empty'

import { cn } from 'utils/cn'
import { useLayoutEffect } from 'utils/general'

// Load collections in pages of 100 (each page has 100 collections).
const defaultTake = 100

// Pre-load the next page of collections on scroll.
const overscan = 10

// Get the Prisma skip and take from the URL search params.
export const getPagination = (searchParams: URLSearchParams) => ({
  skip: Number(searchParams.get('skip') || '0'),
  take: Number(searchParams.get('take') || defaultTake.toString()),
})

export type InfiniteListItemProps<T> = { item?: T }
export type InfiniteListProps<T> = {
  sessionStorageKey: string
  items: T[]
  item: FC<InfiniteListItemProps<T>>
  itemAspectRatio: number
  itemCount: number
  itemsPerRow: number
  setItemsPerRow: Dispatch<SetStateAction<number>>
  emptyMessage?: string
  className?: string
}

// The min width of a single item.
const minItemWidth = 240

// The margin between each collection item.
const itemMarginX = 8
const itemMarginY = 36

export function InfiniteList<T>({
  itemCount,
  emptyMessage,
  className,
  ...props
}: InfiniteListProps<T>) {
  if (itemCount === 0)
    return <Empty className={cn('m-6', className)}>{emptyMessage}</Empty>
  return (
    <InfiniteListContent
      itemCount={itemCount}
      className={className}
      {...props}
    />
  )
}

function InfiniteListContent<T>({
  sessionStorageKey,
  items,
  item: Item,
  itemAspectRatio,
  itemCount,
  itemsPerRow,
  setItemsPerRow,
  className,
}: Omit<InfiniteListProps<T>, 'emptyMessage'>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { skip, take } = getPagination(searchParams)

  // The total width of the grid.
  const [innerRef, { width: totalWidth }] = useMeasure()
  const outerRef = useRef<HTMLDivElement>(null)

  // Reduce the number of items per row as viewport shrinks.
  useLayoutEffect(() => {
    setItemsPerRow(Math.floor(totalWidth / minItemWidth))
  }, [setItemsPerRow, totalWidth])

  // The height of each row (480px for item + 36px for margin).
  const itemWidth = totalWidth / itemsPerRow

  // Derive the item height from width (9:16 image + 50px text + 36px margin).
  const itemHeight = itemWidth / itemAspectRatio + 50 + itemMarginY

  // Infinite scroll the collections grid list.
  const virtualizer = useVirtualizer({
    getScrollElement: () => outerRef.current,
    estimateSize: () => itemHeight,
    lanes: itemsPerRow,
    overscan: 10,
    count: itemCount,
    initialRect: { width: 0, height: 1000 },
  })
  useLayoutEffect(() => virtualizer.measure(), [itemHeight, virtualizer])

  // Save the user's scroll position and restore it upon revisiting the page.
  const navigation = useNavigation()
  useEffect(() => {
    if (navigation.location && outerRef.current)
      sessionStorage.setItem(
        sessionStorageKey,
        outerRef.current.scrollTop.toString(),
      )
  }, [sessionStorageKey, navigation, outerRef])
  useBeforeUnload(
    useCallback(() => {
      if (outerRef.current)
        sessionStorage.setItem(
          sessionStorageKey,
          outerRef.current.scrollTop.toString(),
        )
    }, [sessionStorageKey, outerRef]),
  )
  useLayoutEffect(() => {
    const infiniteScrollTop = sessionStorage.getItem(sessionStorageKey)
    if (totalWidth && outerRef.current && infiniteScrollTop)
      outerRef.current.scrollTo({ top: Number(infiniteScrollTop) })
  }, [sessionStorageKey, outerRef, totalWidth])

  // Load the results necessary to collection the current window of data.
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
    <div
      ref={outerRef}
      className={cn('overflow-y-auto overflow-x-hidden p-6', className)}
    >
      <ol
        ref={innerRef}
        style={{
          visibility: totalWidth ? 'visible' : 'hidden',
          height: `${virtualizer.getTotalSize()}px`,
          margin: `-${itemMarginX / 2}px`,
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
                padding: `${itemMarginX / 2}px`,
              }}
            >
              <Item item={item} />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
