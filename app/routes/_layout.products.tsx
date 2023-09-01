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

import { Banner } from 'components/banner'
import { Carousel, type CarouselItemProps } from 'components/carousel'
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
      include: { brands: true, variants: { include: { images: true } } },
      take: 100,
      where,
    })
  ).map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brands.map((brand) => brand.name).join(' x '),
    images: product.variants.flatMap((v) => v.images).map((image) => image.url),
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
      <Banner>
        Products are aggregated from across the web and show prices direct from
        the brand (e.g. Ralph Lauren, Gucci), from third-party retailers (e.g.
        Nordstrom, Neiman Marcus, SSENSE), and from secondary markets (e.g.
        StockX, GOAT, Ebay). You can add filters (by clicking the “+” button
        below or by typing “f”) to refine your results by brand (e.g. Louis
        Vuitton, Prada), style (e.g. Pants, Tops), variant (e.g. Blue, Pink),
        designer (e.g. Pharrell Williams, Virgil Abloh), and many more product
        attributes.
      </Banner>
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
        <ol
          className='grid gap-x-3 gap-y-6'
          style={{
            gridTemplateColumns: `repeat(${resultsPerRow}, minmax(0, 1fr))`,
          }}
        >
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

type ProductItemProps = {
  id: number
  brand: string
  name: string
  images: string[]
  msrp?: number
  index: number
  resultsPerRow: number
}

function ProductItem({
  id,
  brand,
  name,
  images,
  msrp,
  index,
  resultsPerRow,
}: ProductItemProps) {
  const location = useLocation()
  return (
    <Link
      className='block text-xs'
      prefetch='intent'
      to={`${id}${location.search}`}
    >
      <li className='flex flex-col gap-2'>
        <Carousel
          items={images.map((url) => ({ id: url, index, resultsPerRow }))}
          item={ProductImage}
        />
        <div>
          <h2 className='font-medium uppercase'>{brand}</h2>
          <h3 className='leading-none'>{name}</h3>
          <p>${msrp}</p>
        </div>
      </li>
    </Link>
  )
}

function ProductImage({
  item: image,
  index,
}: CarouselItemProps<{ id: string; index: number; resultsPerRow: number }>) {
  return (
    <div className='w-full aspect-product'>
      {image && (
        <Image
          className='h-full w-full object-cover'
          loading={
            index === 0 && image.index < image.resultsPerRow * rowsToEagerLoad
              ? 'eager'
              : 'lazy'
          }
          decoding={
            index === 0 && image.index < image.resultsPerRow * rowsToEagerLoad
              ? 'sync'
              : 'async'
          }
          src={image.id}
          responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
            (width) => ({
              size: { width },
              maxWidth: width * image.resultsPerRow,
            }),
          )}
        />
      )}
    </div>
  )
}
