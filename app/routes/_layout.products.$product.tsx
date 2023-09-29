import { NavLink, Outlet, useLoaderData, useParams } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import invariant from 'tiny-invariant'

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
    <div className='h-0 grow overflow-auto flex w-full items-start gap-6 p-2'>
      <Outlet />
      <div className='flex w-0 flex-1 flex-col gap-3 sticky top-0'>
        <h1>{product.name}</h1>
        <section>
          <h2>Properties</h2>
          <dl>
            <dt>Slug</dt>
            <dd>{product.slug}</dd>
            <dt>Level</dt>
            <dd>{product.level}</dd>
            <dt>MSRP</dt>
            <dd>
              ${(Math.round(Number(product.msrp) * 100) / 100).toFixed(2)}
            </dd>
            <dt>Designed at</dt>
            <dd>
              {new Date(product.designedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </dd>
            <dt>Released at</dt>
            <dd>
              {new Date(product.releasedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </dd>
            <dt>Imported at</dt>
            <dd>
              {new Date(product.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </dd>
            <dt>Last update at</dt>
            <dd>
              {new Date(product.updatedAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </dd>
          </dl>
        </section>
        <section>
          <h2>Colors</h2>
          <ul className='flex gap-1'>
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
        </section>
        <section>
          <h2>Sizes</h2>
          <ul className='flex gap-1'>
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
        </section>
        <section>
          <h2>Prices</h2>
          {variant?.prices.map((price) => (
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
          ))}
        </section>
      </div>
    </div>
  )
}
