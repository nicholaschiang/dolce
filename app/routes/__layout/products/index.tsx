import type { Dispatch, SetStateAction } from 'react'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons'
import { useCallback, useMemo, useState } from 'react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useHotkeys } from 'react-hotkeys-hook'

import { Filters } from 'components/filters'
import { Image } from 'components/image'
import { Tooltip } from 'components/tooltip'

import {
  FILTER_PARAM,
  JOIN_PARAM,
  filterToPrismaWhere,
  filterToSearchParam,
  filterToString,
  searchParamToFilter,
} from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Omit<ProductItemProps, 'index' | 'resultsPerRow'>[]

// users can control prisma queries via url search parameters.
// Ex: /products?f=price:gt:100&f=price:lt:200&j=OR
// ... will return products with a price between 100 and 200.
export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const filters = searchParams.getAll(FILTER_PARAM).map(searchParamToFilter)
  let join = searchParams.get(JOIN_PARAM)
  if (!join || !['AND', 'OR', 'NOT'].includes(join)) join = 'AND'
  log.debug(
    'getting products... %s',
    filters.map(filterToString).join(` ${join} `),
  )
  const products = (
    await prisma.product.findMany({
      include: { images: true },
      where: { [join]: filters.map(filterToPrismaWhere) },
    })
  ).map((product) => ({
    id: product.id,
    name: product.name,
    images: product.images.map((image) => image.url),
    // real users don't care about cents. most reputable brands won't include
    // cents in their prices anyway. prices that do include cents are usually
    // intended to be misleading (e.g. $69.70 instead of $70).
    msrp: product.msrp ? Math.round(Number(product.msrp)) : undefined,
  }))
  log.debug('got %d products', products.length)
  return json<LoaderData>(products)
}

export default function ProductsPage() {
  const products = useLoaderData<LoaderData>()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo<Filter[]>(
    () => searchParams.getAll(FILTER_PARAM).map(searchParamToFilter),
    [searchParams],
  )
  const setFilters = useCallback<Dispatch<SetStateAction<Filter[]>>>(
    (action: SetStateAction<Filter[]>) => {
      setSearchParams((prevSearchParams) => {
        let nextFilters: Filter[]
        if (typeof action === 'function') {
          const prevFilters = prevSearchParams
            .getAll(FILTER_PARAM)
            .map(searchParamToFilter)
          nextFilters = action(prevFilters)
        } else {
          nextFilters = action
        }
        const nextSearchParams = new URLSearchParams(prevSearchParams)
        nextSearchParams.delete(FILTER_PARAM)
        nextFilters.forEach((filter) =>
          nextSearchParams.append(FILTER_PARAM, filterToSearchParam(filter)),
        )
        return nextSearchParams
      })
    },
    [setSearchParams],
  )
  // TODO create a useSessionState hook to conveniently persist state in the
  // user's session cookie (so that, unlike persisting state in localStorage, we
  // can use it during SSR to prevent a flash of layout shift).
  // TODO intelligently choose the initial value based on the viewport width.
  const [resultsPerRow, setResultsPerRow] = useState(6)
  return (
    <>
      <Filters modelName='Product' filters={filters} setFilters={setFilters}>
        <ResultsPerRowSelect
          resultsPerRow={resultsPerRow}
          setResultsPerRow={setResultsPerRow}
        />
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

// There must be at least one product per row.
const minResultsPerRow = 1

// Only allow users to zoom out to 20 products per row.
const maxResultsPerRow = 20

type ResultsPerRowSelectProps = {
  resultsPerRow: number
  setResultsPerRow: Dispatch<SetStateAction<number>>
}

function ResultsPerRowSelect({
  resultsPerRow,
  setResultsPerRow,
}: ResultsPerRowSelectProps) {
  const zoomIn = useCallback(() => {
    setResultsPerRow((prev) => Math.max(prev - 1, minResultsPerRow))
  }, [setResultsPerRow])
  const zoomOut = useCallback(() => {
    setResultsPerRow((prev) => Math.min(prev + 1, maxResultsPerRow))
  }, [setResultsPerRow])

  // TODO right now, I'm using = as the hotkey because I don't want users to
  // have to shift+= (to properly type a + character). Should I be doing this?
  useHotkeys(
    '=',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      zoomIn()
    },
    [zoomIn],
  )
  useHotkeys(
    '-',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      zoomOut()
    },
    [zoomOut],
  )

  return (
    <div className='flex items-center justify-center'>
      <Tooltip tip='Zoom In' hotkey='+'>
        <button
          type='button'
          aria-label='Zoom In'
          className='icon-button'
          disabled={resultsPerRow === minResultsPerRow}
          onClick={zoomIn}
        >
          <ZoomInIcon className='h-3.5 w-3.5' />
        </button>
      </Tooltip>
      <Tooltip tip='Zoom Out' hotkey='-'>
        <button
          type='button'
          aria-label='Zoom Out'
          className='icon-button'
          disabled={resultsPerRow === maxResultsPerRow}
          onClick={zoomOut}
        >
          <ZoomOutIcon className='h-3.5 w-3.5' />
        </button>
      </Tooltip>
    </div>
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
  return (
    <li
      className='shrink-0 grow-0'
      style={{ flexBasis: `${(1 / resultsPerRow) * 100}%` }}
    >
      <div className='relative m-2'>
        <div
          className='absolute w-full'
          style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
        >
          <Image
            className='absolute top-0 h-full w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800'
            loading={index < resultsPerRow * rowsToEagerLoad ? 'eager' : 'lazy'}
            decoding={
              index < resultsPerRow * rowsToEagerLoad ? 'sync' : 'async'
            }
            src={images.slice(-1)[0]}
            data-image={images.slice(-1)[0]}
            responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
              (width) => ({
                size: { width, height: width * widthToHeightImageRatio },
                maxWidth: width * resultsPerRow,
              }),
            )}
          />
        </div>
        <Link prefetch='intent' to={`/products/${id}`}>
          <div
            className='relative mb-2 rounded-md'
            style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
          />
          <h2 className='leading-none'>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  )
}
