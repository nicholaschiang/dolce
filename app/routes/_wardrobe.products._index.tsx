import { useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import {
  type SerializeFrom,
  type DataFunctionArgs,
  type MetaFunction,
} from '@vercel/remix'
import { Plus, Minus } from 'lucide-react'
import { useState, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useProducts } from 'routes/_wardrobe'

import { Carousel, type CarouselItemProps } from 'components/carousel'
import { FiltersBar, getWhere } from 'components/filters-bar'
import {
  getPagination,
  InfiniteList,
  type InfiniteListItemProps,
} from 'components/infinite-list'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemSubtitle,
  ItemDescription,
} from 'components/item'
import { SaveMenu } from 'components/save-menu'
import { Button } from 'components/ui/button'

import { NAME, PRODUCT_ASPECT_RATIO, useOptionalUser } from 'utils/general'
import { getBrandName } from 'utils/product'

import { prisma } from 'db.server'
import { type ProductFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'
import { getUserId } from 'session.server'

export const meta: MetaFunction = () => [{ title: `Products | ${NAME}` }]

export const handle: Handle = {
  breadcrumb: () => ({ to: '/products', children: 'Products' }),
}

export async function loader({ request }: DataFunctionArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting products... %s', string)
  const userId = await getUserId(request)
  const [products, filteredCount, totalCount] = await Promise.all([
    prisma.product.findMany({
      ...getPagination(new URL(request.url).searchParams),
      include: {
        brands: true,
        // TODO order the variants by whichever has the cheapest price. Right
        // now, we just show the cheapest price of an arbitrary variant.
        variants: {
          include: {
            images: { orderBy: { position: 'asc' } },
            prices: { orderBy: { value: 'asc' }, take: 1 },
            sets: userId ? { where: { authorId: userId } } : false,
          },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      where,
      orderBy: [{ releasedAt: 'desc' }, { id: 'desc' }],
    }),
    prisma.product.count({ where }),
    prisma.product.count(),
  ])
  log.debug('got %d products', products.length)
  return { products, filteredCount, totalCount }
}

// There must be at least one product per row.
const minResultsPerRow = 1

// Only allow users to zoom out to 20 products per row.
const maxResultsPerRow = 20

// Don't allow users to filter on back-end only fields.
const hiddenFields: ProductFilterName[] = ['looks']

export default function ProductsPage() {
  const { products, filteredCount, totalCount } = useLoaderData<typeof loader>()
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
      <FiltersBar
        modelName='Product'
        hiddenFields={hiddenFields}
        maxZoom={maxResultsPerRow}
        minZoom={minResultsPerRow}
        zoom={resultsPerRow}
        setZoom={setResultsPerRow}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
      <InfiniteList
        items={products}
        item={ProductItem}
        itemAspectRatio={PRODUCT_ASPECT_RATIO}
        itemCount={filteredCount}
        itemsPerRow={resultsPerRow}
        setItemsPerRow={setResultsPerRow}
        sessionStorageKey='products'
        emptyMessage='There are no products that match your filters.'
        className='h-0 grow'
      />
    </>
  )
}

//////////////////////////////////////////////////////////////////

export type Product = SerializeFrom<typeof loader>['products'][number]

function ProductItem({ item: product }: InfiniteListItemProps<Product>) {
  // real users don't care about cents. most reputable brands won't include
  // cents in their prices anyway. prices that do include cents are usually
  // intended to be misleading (e.g. $69.70 instead of $70).
  const msrp = product?.msrp ? Math.round(Number(product.msrp)) : undefined
  const priceString = product?.variants[0]?.prices[0]?.value
  const price = priceString ? Math.round(Number(priceString)) : undefined
  const user = useOptionalUser()
  const variant = product?.variants[0]
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <Item to={`${product?.slug}/variants/${variant?.id}`}>
      <Carousel items={variant?.images} item={ProductImage}>
        <div className='ml-auto flex flex-col gap-1'>
          {user && product && <AddButton product={product} />}
          {user && variant && (
            <SaveMenu
              ref={ref}
              saveAPI={`/api/variants/${variant.id}/save`}
              createAPI={`/api/variants/${variant.id}/save/create`}
              sets={variant.sets}
              aria-label='Save product'
              className='pointer-events-auto'
            />
          )}
        </div>
      </Carousel>
      {product && (
        <ItemContent>
          <ItemTitle>{getBrandName(product)}</ItemTitle>
          <ItemSubtitle>{product.name}</ItemSubtitle>
          <ItemDescription>
            ${price ?? msrp}{' '}
            {price && msrp && price < msrp && (
              <span className='line-through'>${msrp}</span>
            )}
          </ItemDescription>
        </ItemContent>
      )}
    </Item>
  )
}

function AddButton({ product }: { product: Product }) {
  const [products, setProducts] = useProducts()
  const selected = products.some((p) => p.id === product.id)
  return (
    <Button
      size='icon'
      variant={selected ? 'default' : 'ghost'}
      className='pointer-events-auto'
      onClick={() =>
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === product.id)
          if (idx < 0) return [product, ...prev]
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
        })
      }
    >
      {selected ? <Minus className='w-3 h-3' /> : <Plus className='w-3 h-3' />}
    </Button>
  )
}

type Image = Product['variants'][number]['images'][number]

function ProductImage({ item: image }: CarouselItemProps<Image>) {
  return (
    <div className='w-full aspect-product'>
      {image && (
        <img
          className='h-full w-full object-cover'
          loading='lazy'
          decoding='async'
          src={image.url}
          alt=''
        />
      )}
    </div>
  )
}
