import { Outlet } from '@remix-run/react'
import {
  type DataFunctionArgs,
  type SerializeFrom,
  type MetaFunction,
} from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'
import invariant from 'tiny-invariant'

import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
} from 'components/layout'

import { NAME } from 'utils/general'

import { prisma } from 'db.server'
import { type Filter, FILTER_PARAM, filterToSearchParam } from 'filters'
import { type Handle } from 'root'

import { Details } from './details'
import { Header } from './header'
import { Properties } from './properties'
import { Variants } from './variants'

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
  return (
    <Layout>
      <LayoutLeft>
        <Outlet />
      </LayoutLeft>
      <LayoutDivider />
      <LayoutRight>
        <Header />
        <Properties />
        <Variants />
        <Details />
      </LayoutRight>
    </Layout>
  )
}
