import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode, type RefObject, useState, useRef } from 'react'

import { Button } from 'components/ui/button'

import { cn } from 'utils/cn'

// The width of the pagination dot.
const dotSize = 6

// The margin between each pagination dot.
const dotMargin = 2

// The number of dots (should be an odd number so there is a center dot).
const maxDots = 5

export type CarouselItemProps<T> = { item?: T; index: number }
export type CarouselProps<T> = {
  loading?: boolean
  items?: T[]
  item: (props: CarouselItemProps<T>) => ReactNode
  itemWidth: number
  itemsPerSlide: number
  children?: ReactNode
  className?: string
}

export function Carousel<T extends { id: number | string }>({
  loading,
  items,
  item,
  itemWidth,
  itemsPerSlide,
  children,
  className,
}: CarouselProps<T>) {
  const [index, setIndex] = useState(0)
  const carouselRef = useRef<HTMLOListElement>(null)
  return (
    <div
      className={cn('relative group overflow-clip', className)}
      style={{ width: itemWidth * itemsPerSlide }}
    >
      <ol
        className={cn(
          'flex overflow-auto snap-x bg-gray-100 dark:bg-gray-900 scrollbar-hide',
          !items && loading && 'animate-pulse',
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
        {!items?.length && (
          <li className='flex-none' style={{ width: itemWidth }}>
            {item({ index: 0 })}
          </li>
        )}
        {items?.map((i, idx) => (
          <li
            key={i.id}
            style={{ width: itemWidth }}
            className='flex-none snap-start'
          >
            {item({ item: i, index: idx })}
          </li>
        ))}
      </ol>
      <div
        className={cn(
          'absolute inset-0 flex flex-col p-3 pointer-events-none',
          items &&
            items.length > 0 &&
            'bg-gradient-to-b from-transparent from-80% to-black/25',
        )}
      >
        <div className='flex-1 flex justify-between items-start'>
          {children}
        </div>
        {items && items.length > 1 && (
          <>
            <PaginationButtons
              index={index}
              numOfItems={items.length}
              itemWidth={itemWidth}
              itemsPerSlide={itemsPerSlide}
              carouselRef={carouselRef}
            />
            <Dots
              index={index}
              numOfItems={items.length}
              itemsPerSlide={itemsPerSlide}
            />
          </>
        )}
      </div>
    </div>
  )
}

function PaginationButtons({
  index,
  numOfItems,
  itemWidth,
  itemsPerSlide,
  carouselRef,
}: {
  index: number
  numOfItems: number
  itemWidth: number
  itemsPerSlide: number
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
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
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
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
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

function Dots({
  index,
  numOfItems,
  itemsPerSlide,
}: {
  index: number
  numOfItems: number
  itemsPerSlide: number
}) {
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
