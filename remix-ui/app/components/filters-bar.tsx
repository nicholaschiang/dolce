import { useSearchParams } from '@remix-run/react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useEffect,
  useCallback,
} from 'react'

import { Filters, type FiltersProps } from 'components/filters'
import { Tooltip } from 'components/tooltip'
import { Button } from 'components/ui/button'

import {
  type Filter,
  type FilterName,
  type FilterCondition,
  FILTER_PARAM,
  JOIN_PARAM,
  filterToPrismaWhere,
  filterToSearchParam,
  filterToString,
  searchParamToFilter,
} from 'filters'

enum Join {
  And = 'AND',
  Or = 'OR',
  Not = 'NOT',
}

// Filter for products matching all filters by default.
const defaultJoin = Join.And

function isJoin(join: unknown): join is Join {
  return typeof join === 'string' && Object.values(Join).includes(join as Join)
}

function getJoinFromSearchParams(searchParams: URLSearchParams): Join {
  const join = searchParams.get(JOIN_PARAM)
  return isJoin(join) ? join : defaultJoin
}

export function getWhere(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = searchParams.getAll(FILTER_PARAM).map(searchParamToFilter)
  const join = getJoinFromSearchParams(searchParams)
  const where = { [join]: filters.map(filterToPrismaWhere) }
  const string = filters.map(filterToString).join(` ${join} `)
  return { where, string }
}

export type FiltersBarProps = Omit<
  FiltersProps,
  'children' | 'filters' | 'setFilters'
> & {
  maxZoom: number
  minZoom: number
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
  filteredCount: number
  totalCount: number
}

export function FiltersBar({
  maxZoom,
  minZoom,
  zoom,
  setZoom,
  filteredCount,
  totalCount,
  ...etc
}: FiltersBarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo<Filter[]>(
    () => searchParams.getAll(FILTER_PARAM).map(searchParamToFilter),
    [searchParams],
  )
  const setFilters = useCallback<Dispatch<SetStateAction<Filter[]>>>(
    (action: SetStateAction<Filter[]>) => {
      setSearchParams(
        (prevSearchParams) => {
          const prev = prevSearchParams
            .getAll(FILTER_PARAM)
            .map(searchParamToFilter)
          const next = typeof action === 'function' ? action(prev) : action
          if (next === prev) return prevSearchParams
          const nextSearchParams = new URLSearchParams(prevSearchParams)
          nextSearchParams.delete(FILTER_PARAM)
          next.forEach((filter) =>
            nextSearchParams.append(
              FILTER_PARAM,
              filterToSearchParam<FilterName, FilterCondition>(filter),
            ),
          )
          return nextSearchParams
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const join = getJoinFromSearchParams(searchParams)
  const setJoin = useCallback(
    (action: SetStateAction<Join>) => {
      setSearchParams(
        (prevSearchParams) => {
          const prev = getJoinFromSearchParams(prevSearchParams)
          const next = typeof action === 'function' ? action(prev) : action
          if (next === prev) return prevSearchParams
          const nextSearchParams = new URLSearchParams(prevSearchParams)
          nextSearchParams.set(JOIN_PARAM, next)
          return nextSearchParams
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  // Reset the filter join when the user clears their filters.
  useEffect(() => {
    if (filters.length <= 1) setJoin(defaultJoin)
  }, [filters.length, setJoin])

  const zoomOut = () => setZoom((prev) => Math.min(prev + 1, maxZoom))
  const zoomIn = () => setZoom((prev) => Math.max(prev - 1, minZoom))

  return (
    <Filters {...etc} filters={filters} setFilters={setFilters}>
      <div className='flex items-center gap-2 text-xs'>
        {filters.length > 1 && (
          <div className='whitespace-nowrap'>
            <span className='text-gray-400 dark:text-gray-600'>
              include results that match
            </span>
            <button
              type='button'
              className='rounded px-1 hover:bg-gray-50 hover:dark:bg-gray-800'
              onClick={() =>
                setJoin((prev) => {
                  const joins = Object.values(Join)
                  const index = joins.indexOf(prev)
                  return joins[(index + 1) % joins.length]
                })
              }
            >
              {join === Join.Or && 'any filter'}
              {join === Join.And && 'all filters'}
              {join === Join.Not && 'no filters'}
            </button>
          </div>
        )}
        {filters.length > 0 && (
          <div className='whitespace-nowrap text-gray-600 dark:text-gray-400'>
            {filteredCount}
            <span className='text-gray-400 dark:text-gray-600'>
              {' / '}
              {totalCount}
            </span>
          </div>
        )}
        <div className='flex items-center'>
          <Tooltip tip='Zoom In' hotkey='=' onHotkey={zoomIn}>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              aria-label='Zoom In'
              disabled={zoom === minZoom}
              onClick={zoomIn}
            >
              <ZoomIn className='h-3 w-3' />
            </Button>
          </Tooltip>
          <Tooltip tip='Zoom Out' hotkey='-' onHotkey={zoomOut}>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              aria-label='Zoom Out'
              disabled={zoom === maxZoom}
              onClick={zoomOut}
            >
              <ZoomOut className='h-3 w-3' />
            </Button>
          </Tooltip>
        </div>
      </div>
    </Filters>
  )
}
