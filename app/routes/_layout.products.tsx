import type { Prisma } from '@prisma/client'
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { type LoaderArgs, type V2_MetaFunction } from '@vercel/remix'
import { ZoomIn, ZoomOut } from 'lucide-react'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Filters } from 'components/filters'
import { Image } from 'components/image'
import { Tooltip } from 'components/tooltip'

import { prisma } from 'db.server'
import {
  type Filter,
  FILTER_PARAM,
  JOIN_PARAM,
  filterToPrismaWhere,
  filterToSearchParam,
  filterToString,
  searchParamToFilter,
} from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const meta: V2_MetaFunction = () => [
  { title: 'Products | Nicholas Chiang' },
]

export const handle: Handle = {
  breadcrumb: () => (
    <Link prefetch='intent' to='/products'>
      products
    </Link>
  ),
}

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

async function getProducts({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url)
  const filters = searchParams.getAll(FILTER_PARAM).map(searchParamToFilter)
  const join = getJoinFromSearchParams(searchParams)
  log.debug(
    'getting products... %s',
    filters.map(filterToString).join(` ${join} `),
  )
  const products = (
    await prisma.product.findMany({
      include: { variants: { include: { images: true } } },
      where: { [join]: filters.map(filterToPrismaWhere) },
      take: 100,
    })
  ).map((product) => ({
    id: product.id,
    name: product.name,
    images: product.variants
      .map((v) => v.images)
      .flat()
      .map((image) => image.url),
    // real users don't care about cents. most reputable brands won't include
    // cents in their prices anyway. prices that do include cents are usually
    // intended to be misleading (e.g. $69.70 instead of $70).
    msrp: product.msrp ? Math.round(Number(product.msrp)) : undefined,
  }))
  log.debug('got %d products', products.length)
  return products
}

async function getCount() {
  log.debug('getting products count...')
  const count = await prisma.product.count()
  log.debug('got product count: %d', count)
  return count
}

// users can control prisma queries via url search parameters.
// Ex: /products?f=price:gt:100&f=price:lt:200&j=OR
// ... will return products with a price between 100 and 200.
export async function loader(args: LoaderArgs) {
  const [products, count] = await Promise.all([getProducts(args), getCount()])
  return { products, count }
}

// Don't allow users to filter on back-end only fields.
const hiddenFields: (keyof Prisma.ProductSelect)[] = []

// There must be at least one product per row.
const minResultsPerRow = 1

// Only allow users to zoom out to 20 products per row.
const maxResultsPerRow = 20

export default function ProductsPage() {
  const { products, count } = useLoaderData<typeof loader>()
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
            nextSearchParams.append(FILTER_PARAM, filterToSearchParam(filter)),
          )
          return nextSearchParams
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )
  const nav = useNavigate()
  const location = useLocation()
  useHotkeys(
    ' ',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      nav(`${products[0].id}${location.search}`)
    },
    [nav, products, location.search],
  )
  // TODO create a useSessionState hook to conveniently persist state in the
  // user's session cookie (so that, unlike persisting state in localStorage, we
  // can use it during SSR to prevent a flash of layout shift).
  // TODO intelligently choose the initial value based on the viewport width.
  const [resultsPerRow, setResultsPerRow] = useState(6)
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

  const zoomIn = useCallback(() => {
    setResultsPerRow((prev) => Math.max(prev - 1, minResultsPerRow))
  }, [setResultsPerRow])
  const zoomOut = useCallback(() => {
    setResultsPerRow((prev) => Math.min(prev + 1, maxResultsPerRow))
  }, [setResultsPerRow])
  return (
    <>
      <Outlet />
      <Filters
        modelName='Product'
        filters={filters}
        setFilters={setFilters}
        hiddenFields={hiddenFields}
      >
        <div className='flex items-center gap-2 text-xs'>
          {filters.length > 1 && (
            <div className='whitespace-nowrap'>
              <span className='mt-1 text-gray-400 dark:text-gray-600'>
                include products that match
              </span>
              <button
                type='button'
                className='rounded px-1 pt-1 hover:bg-gray-50 hover:dark:bg-gray-800'
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
            <div className='mt-1 whitespace-nowrap text-gray-600 dark:text-gray-400'>
              {products.length}
              <span className='text-gray-400 dark:text-gray-600'>
                {' / '}
                {count}
              </span>
            </div>
          )}
          <div className='flex items-center'>
            <Tooltip tip='Zoom In' hotkey='=' onHotkey={zoomIn}>
              <button
                type='button'
                aria-label='Zoom In'
                className='icon-button'
                disabled={resultsPerRow === minResultsPerRow}
                onClick={zoomIn}
              >
                <ZoomIn className='h-3.5 w-3.5' />
              </button>
            </Tooltip>
            <Tooltip tip='Zoom Out' hotkey='-' onHotkey={zoomOut}>
              <button
                type='button'
                aria-label='Zoom Out'
                className='icon-button'
                disabled={resultsPerRow === maxResultsPerRow}
                onClick={zoomOut}
              >
                <ZoomOut className='h-3.5 w-3.5' />
              </button>
            </Tooltip>
          </div>
        </div>
      </Filters>
      <div className='h-full flex-1 overflow-y-auto overflow-x-hidden p-6'>
        <ol className='-m-2 flex flex-wrap'>
          {products.map((product, index) => (
            <ProductItem
              {...product}
              key={product.id}
              index={index}
              resultsPerRow={resultsPerRow}
            />
          ))}
        </ol>
      </div>
    </>
  )
}

//////////////////////////////////////////////////////////////////

// Eagerly load images for the first two rows of products.
const rowsToEagerLoad = 2

// Images are currently sized w:h = 1:1.25 (e.g. Isabel Marant).
const widthToHeightImageRatio = 1.25

type ProductItemProps = {
  id: number
  name: string
  images: string[]
  msrp?: number
  index: number
  resultsPerRow: number
}

function ProductItem({
  id,
  name,
  images,
  msrp,
  index,
  resultsPerRow,
}: ProductItemProps) {
  const location = useLocation()
  return (
    <li
      className='group shrink-0 grow-0'
      style={{ flexBasis: `${(1 / resultsPerRow) * 100}%` }}
    >
      <div className='relative m-2'>
        <div
          className='absolute w-full'
          style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
        >
          {images.length > 1 && (
            <Image
              className='absolute top-0 z-20 h-full w-full overflow-hidden rounded-md bg-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-900'
              loading='lazy'
              decoding='async'
              src={images[1]}
              responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
                (width) => ({
                  size: { width },
                  maxWidth: width * resultsPerRow,
                }),
              )}
            />
          )}
          <Image
            className='absolute top-0 z-10 h-full w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900'
            loading={index < resultsPerRow * rowsToEagerLoad ? 'eager' : 'lazy'}
            decoding={
              index < resultsPerRow * rowsToEagerLoad ? 'sync' : 'async'
            }
            src={images[0]}
            responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
              (width) => ({
                size: { width, height: width * widthToHeightImageRatio },
                maxWidth: width * resultsPerRow,
              }),
            )}
          />
        </div>
        <Link prefetch='intent' to={`${id}${location.search}`}>
          <div
            className='relative z-30 mb-2 rounded-md'
            style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
          />
          <h2 className='leading-none'>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  )
}
