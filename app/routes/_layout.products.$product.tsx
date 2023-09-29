import { NavLink, Outlet, useLoaderData, useParams } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import invariant from 'tiny-invariant'

import { Info, InfoItem } from 'components/info'
import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
  LayoutSection,
} from 'components/layout'
import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { NAME } from 'utils/general'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM, filterToSearchParam } from 'filters'
import { type Handle } from 'root'

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
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

export async function loader({ params }: LoaderArgs) {
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
  const variant = variantId
    ? product.variants.find((v) => v.id.toString() === variantId)
    : product.variants[0]
  return (
    <Layout>
      <LayoutLeft>
        <Outlet />
      </LayoutLeft>
      <LayoutDivider />
      <LayoutRight>
        <article className='bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6'>
          <h1 className='font-medium'>{product.name}</h1>
        </article>
        <LayoutSection id='properties' header='Properties'>
          <Info>
            <InfoItem label='Slug'>{product.slug}</InfoItem>
            <InfoItem label='Level'>{product.level}</InfoItem>
            <InfoItem label='MSRP'>
              ${(Math.round(Number(product.msrp) * 100) / 100).toFixed(2)}
            </InfoItem>
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
        <LayoutSection id='colors' header='Colors'>
          <ul className='flex flex-wrap gap-1'>
            {product.variants
              .filter(
                (v) => variant == null || v.size.name === variant.size.name,
              )
              .map((v) => (
                <li key={v.id}>
                  <NavLink
                    className={({ isActive }) =>
                      buttonVariants({
                        variant: isActive ? 'default' : 'outline',
                        size: 'sm',
                      })
                    }
                    to={`variants/${v.id}`}
                  >
                    {v.colors.map((c) => c.name).join(' / ')}
                  </NavLink>
                </li>
              ))}
          </ul>
        </LayoutSection>
        <LayoutSection id='sizes' header='Sizes'>
          <ul className='flex flex-wrap gap-1'>
            {product.variants
              .filter(
                (v) =>
                  variant == null ||
                  v.colors.map((c) => c.name).join() ===
                    variant.colors.map((c) => c.name).join(),
              )
              .map((v) => (
                <li key={v.id}>
                  <NavLink
                    className={({ isActive }) =>
                      buttonVariants({
                        variant: isActive ? 'default' : 'outline',
                        size: 'sm',
                      })
                    }
                    to={`variants/${v.id}`}
                  >
                    {v.size.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </LayoutSection>
        <LayoutSection id='prices' header='Prices'>
          <ul className='flex flex-wrap gap-1'>
            {variant?.prices.map((price) => (
              <li key={price.id}>
                <a
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'h-auto py-1.5 inline-flex flex-col items-center',
                  )}
                  href={price.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <h3>{(price.brand ?? price.retailer)?.name}</h3>
                  <p>${price.value}</p>
                </a>
              </li>
            ))}
          </ul>
        </LayoutSection>
      </LayoutRight>
    </Layout>
  )
}
