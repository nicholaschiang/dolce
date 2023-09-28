import { useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import {
  type SerializeFrom,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@vercel/remix'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Banner } from 'components/banner'
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

import { NAME } from 'utils/general'

import { prisma } from 'db.server'
import { type ProductFilterName } from 'filters'
import { log } from 'log.server'
import { type Handle } from 'root'

export const meta: V2_MetaFunction = () => [{ title: `Products | ${NAME}` }]

export const handle: Handle = {
  breadcrumb: () => ({ to: '/products', children: 'Products' }),
}

export async function loader({ request }: LoaderArgs) {
  const { where, string } = getWhere(request)
  log.debug('getting products... %s', string)
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
          },
          take: 1,
        },
      },
      where,
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
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
      <InfiniteList
        items={products}
        item={ProductItem}
        itemAspectRatio={500 / 683}
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

type Product = SerializeFrom<typeof loader>['products'][number]

function ProductItem({ item: product }: InfiniteListItemProps<Product>) {
  const location = useLocation()
  // real users don't care about cents. most reputable brands won't include
  // cents in their prices anyway. prices that do include cents are usually
  // intended to be misleading (e.g. $69.70 instead of $70).
  const msrp = product?.msrp ? Math.round(Number(product.msrp)) : undefined
  const priceString = product?.variants[0]?.prices[0]?.value
  const price = priceString ? Math.round(Number(priceString)) : undefined
  return (
    <Item to={`${product?.id}${location.search}`}>
      <Carousel
        items={product?.variants.flatMap((v) => v.images)}
        item={ProductImage}
      />
      {product && (
        <ItemContent>
          <ItemTitle>
            {product?.brands.map((b) => b.name).join(' x ')}
          </ItemTitle>
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
