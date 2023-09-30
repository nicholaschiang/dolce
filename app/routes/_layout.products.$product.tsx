import { Market, type Price } from '@prisma/client'
import { NavLink, Outlet, useLoaderData, useParams } from '@remix-run/react'
import {
  type DataFunctionArgs,
  type SerializeFrom,
  type MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import { type PropsWithChildren } from 'react'
import invariant from 'tiny-invariant'

import { Info, InfoItem } from 'components/info'
import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
  LayoutSection,
} from 'components/layout'
import { Prose } from 'components/prose'
import { Button, buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { NAME, type Serialize } from 'utils/general'
import { getBrandName } from 'utils/product'
import { getColorName } from 'utils/variant'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM, filterToSearchParam } from 'filters'
import { type Handle } from 'root'

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.name ?? '404'} | ${NAME}` },
]

export const handle: Handle = {
  breadcrumb: (match) => {
    const data = match.data as SerializeFrom<typeof loader> | undefined
    if (data == null) return []
    const filter: Filter<'brands', 'some'> = {
      id: nanoid(5),
      name: 'brands',
      condition: 'some',
      value: { id: data.brands[0].id, name: data.brands[0].name },
    }
    const param = filterToSearchParam<'brands', 'some'>(filter)
    return [
      { to: '/products', children: 'Products' },
      {
        to: `/products?${FILTER_PARAM}=${encodeURIComponent(param)}`,
        children: data.brands[0].name,
      },
      {
        to: `/products/${match.params.productId as string}`,
        children: (match.data as SerializeFrom<typeof loader>)?.name ?? '404',
      },
    ]
  },
}

export async function loader({ params }: DataFunctionArgs) {
  invariant(params.product, 'product is required')
  const product = await prisma.product.findUnique({
    where: { slug: params.product },
    include: {
      variants: {
        include: {
          size: true,
          colors: true,
          prices: { include: { brand: true, retailer: true } },
        },
        // TODO instead of relying on the fact that we imported the sizes and
        // colors in the order that we scraped them (which ensures that the size
        // option ordering is intuitive e.g. XS, S, M, LG), we should add an
        // explicit variant `position` field.
        orderBy: { createdAt: 'asc' },
      },
      styles: true,
      collections: true,
      designers: true,
      brands: true,
    },
  })
  if (product === null) throw new Response('Not Found', { status: 404 })
  return product
}

export default function ProductPage() {
  const product = useLoaderData<typeof loader>()
  const { variantId } = useParams()
  const colors = new Set(product.variants.map(getColorName))
  const sizes = new Set(product.variants.map((s) => s.size.name))
  const variant = product.variants.find((v) => v.id.toString() === variantId)
  return (
    <Layout>
      <LayoutLeft>
        <Outlet />
      </LayoutLeft>
      <LayoutDivider />
      <LayoutRight>
        <article className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6'>
          <h2 className='font-semibold'>{getBrandName(product)}</h2>
          <h1>{product.name}</h1>
        </article>
        <LayoutSection id='properties' header='Properties'>
          <Info>
            <InfoItem label='Slug'>{product.slug}</InfoItem>
            <InfoItem label='Level'>{product.level}</InfoItem>
            <InfoItem label='MSRP'>
              ${(Math.round(Number(product.msrp) * 100) / 100).toFixed(2)}
            </InfoItem>
            {variant && <InfoItem label='SKU'>{variant.sku}</InfoItem>}
            <InfoItem label='Designed at'>
              {new Date(product.designedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </InfoItem>
            <InfoItem label='Released at'>
              {new Date(product.releasedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </InfoItem>
            <InfoItem label='Imported at'>
              {new Date(product.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </InfoItem>
            <InfoItem label='Last update'>
              {new Date(product.updatedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </InfoItem>
          </Info>
        </LayoutSection>
        {product.description && (
          <LayoutSection id='details' header='Details'>
            <Prose content={product.description} />
          </LayoutSection>
        )}
        <LayoutSection id='colors' header='Colors'>
          <Options>
            {Array.from(colors).map((color) => {
              const variantsWithColor = product.variants.filter(
                (v) => getColorName(v) === color,
              )
              // Link to the first variant with the color and selected size.
              const active = variantsWithColor.find(
                (v) => variant == null || v.size.name === variant.size.name,
              )
              return (
                <OptionsItem
                  key={color}
                  label={color}
                  prices={variantsWithColor.flatMap((v) => v.prices)}
                  variant={active}
                />
              )
            })}
          </Options>
        </LayoutSection>
        <LayoutSection id='sizes' header='Sizes'>
          <Options>
            {Array.from(sizes).map((size) => {
              const variantsWithSize = product.variants.filter(
                (v) => v.size.name === size,
              )
              // Instead of showing information for all variants with the size,
              // we only show information for variants with the selected color
              // _and_ the size. Users select color first and then size.
              const activeVariants = variantsWithSize.filter(
                (v) =>
                  variant == null || getColorName(v) === getColorName(variant),
              )
              // Link to the first variant with a price. This will do nothing
              // when a color has already been selected. But when a color has
              // not yet been selected, we show the price range of all variants
              // with the given size. Then, when the user clicks on one, we want
              // to redirect to a variant with a price.
              const active =
                activeVariants.find((a) => a.prices.length) ?? activeVariants[0]
              return (
                <OptionsItem
                  key={size}
                  label={size}
                  prices={activeVariants.flatMap((v) => v.prices)}
                  variant={active}
                />
              )
            })}
          </Options>
        </LayoutSection>
        <LayoutSection id='prices' header='Prices'>
          <Options>
            {variant?.prices.map((price) => (
              <li key={price.id}>
                <a
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'h-auto py-1.5 flex-col items-center',
                  )}
                  href={price.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <p className={getMarketColor(price.market)}>{price.market}</p>
                  <h3>{(price.brand ?? price.retailer)?.name}</h3>
                  <p>${price.value}</p>
                </a>
              </li>
            ))}
          </Options>
        </LayoutSection>
      </LayoutRight>
    </Layout>
  )
}

function getMarketColor(market: Market): string {
  return market === Market.PRIMARY
    ? 'text-teal-600 dark:text-teal-500'
    : 'text-amber-600 dark:text-amber-500'
}

function PriceValue({ price }: { price: Serialize<Price> }) {
  return (
    <span className={getMarketColor(price.market)}>
      ${Math.round(Number(price.value))}
    </span>
  )
}

function Options({ children }: PropsWithChildren) {
  return <ul className='flex flex-wrap gap-1'>{children}</ul>
}

function OptionsItem({
  label,
  prices,
  variant,
}: {
  label: string
  prices: Serialize<Price>[]
  variant?: { id: number }
}) {
  let lowest = prices[0]
  let highest = lowest
  prices.forEach((p) => {
    if (lowest == null || Number(p.value) < Number(lowest.value)) lowest = p
    if (highest == null || Number(p.value) > Number(highest.value)) highest = p
  })
  const content = (
    <>
      <h3>{label}</h3>
      {lowest == null || highest == null ? (
        <p className='text-gray-400 dark:text-gray-500 uppercase'>N/A</p>
      ) : lowest.value === highest.value ? (
        <p>
          <PriceValue price={lowest} />
        </p>
      ) : (
        <p>
          <PriceValue price={lowest} /> – <PriceValue price={highest} />
        </p>
      )}
    </>
  )
  return (
    <li>
      {variant ? (
        <NavLink
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'flex-col h-auto py-1.5',
              isActive &&
                'border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800',
            )
          }
          to={`variants/${variant.id}`}
        >
          {content}
        </NavLink>
      ) : (
        <Button variant='outline' size='sm' disabled>
          {content}
        </Button>
      )}
    </li>
  )
}
