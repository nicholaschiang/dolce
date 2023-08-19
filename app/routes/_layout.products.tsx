import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from '@remix-run/react'
import { type LoaderArgs, type V2_MetaFunction } from '@vercel/remix'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { FiltersBar, getWhere } from 'components/filters-bar'
import { Image } from 'components/image'

import { NAME } from 'utils/general'

import { prisma } from 'db.server'
import { type ProductFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const meta: V2_MetaFunction = () => [{ title: `Products | ${NAME}` }]

export const handle: Handle = {
  breadcrumb: () => ({ to: '/products', children: 'Products' }),
}

async function getProducts({ request }: LoaderArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting products... %s', string)
  const products = (
    await prisma.product.findMany({
      include: { variants: { include: { images: true } } },
      take: 100,
      where,
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

// There must be at least one product per row.
const minResultsPerRow = 1

// Only allow users to zoom out to 20 products per row.
const maxResultsPerRow = 20

// Don't allow users to filter on back-end only fields.
const hiddenFields: ProductFilterName[] = []

export default function ProductsPage() {
  const { products, count } = useLoaderData<typeof loader>()
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
  return (
    <>
      <Outlet />
      <FiltersBar
        modelName='Product'
        hiddenFields={hiddenFields}
        maxZoom={maxResultsPerRow}
        minZoom={minResultsPerRow}
        zoom={resultsPerRow}
        setZoom={setResultsPerRow}
        totalCount={count}
        filteredCount={products.length}
      />
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
              className='absolute top-0 z-20 h-full w-full overflow-hidden bg-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-900'
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
            className='absolute top-0 z-10 h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-900'
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
            className='relative z-30 mb-2'
            style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
          />
          <h2 className='leading-none'>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  )
}
