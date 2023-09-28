import * as Popover from '@radix-ui/react-popover'
import { useLoaderData } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { Info } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import { type PropsWithChildren } from 'react'
import invariant from 'tiny-invariant'

import { Image } from 'components/image'

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
  invariant(params.productId, 'productId is required')
  const id = Number(params.productId)
  if (Number.isNaN(id))
    throw new Response('productId must be a number', { status: 400 })
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        include: {
          size: true,
          colors: true,
          prices: true,
          images: { orderBy: { position: 'asc' } },
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

const widthToHeightImageRatio = 4 / 5

export default function ProductPage() {
  const product = useLoaderData<typeof loader>()
  return (
    <div className='h-0 grow overflow-auto flex w-full items-start gap-6 p-6'>
      <div className='w-0 flex-1 grid grid-cols-2 gap-1'>
        {product.variants[0].images.map((image, index) => (
          <div
            key={image.id}
            className='aspect-product bg-gray-100 dark:bg-gray-900'
          >
            <Image
              className='h-full w-full object-cover'
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding={index < 2 ? 'sync' : 'async'}
              src={image.url}
              responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
                (width) => ({
                  size: { width, height: width * widthToHeightImageRatio },
                  maxWidth: width * 2,
                }),
              )}
            />
          </div>
        ))}
      </div>
      <article className='flex w-0 flex-1 flex-col gap-3 sticky top-0'>
        <Section>
          <p className='text-sm text-gray-400 dark:text-gray-600'>
            {product.level}
          </p>
          <h2 className='text-2xl'>{product.name}</h2>
          {product.description && (
            <article
              className='prose prose-sm prose-zinc dark:prose-invert max-w-none'
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </Section>
        <Section>
          <Section.Title>
            sizes
            <Section.Info>
              <Section.InfoHeader>
                The sizes the product was originally made to fit.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A size is a measurement of a product’s dimensions. Sizes can
                either be owned by a brand (for proprietary brand specific
                sizing systems) or a country (for nationwide standardized
                sizes). You can add multiple sizes to your profile. Our system
                will automatically suggest sizes to add based on your previous
                purchases and existing profile sizes.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {[...new Set(product.variants.map((v) => v.size.name))].map(
              (name) => (
                <Chip key={name}>{name}</Chip>
              ),
            )}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            colors
            <Section.Info>
              <Section.InfoHeader>
                The colors the product was originally made in.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A color is a specific colorway of a product. Variants are
                product-specific.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {[
              ...new Set(
                product.variants.map((v) =>
                  v.colors.map((c) => c.name).join(' / '),
                ),
              ),
            ].map((color) => (
              <Chip key={color}>{color}</Chip>
            ))}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            styles
            <Section.Info>
              <Section.InfoHeader>
                The product’s styles. Allegorical to labels (e.g. top, t-shirt,
                v-neck).
              </Section.InfoHeader>
              <Section.InfoDetail>
                A product style category is a high-level grouping of products.
                Styles are a tad bit reminiscent of the typical issue tracking
                tool’s “labels” feature. e.g. blazer, bomber, cardigan, quilted,
                raincoat, jeans, tuxedos, etc.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {product.styles.map((style) => (
              <Chip key={style.id}>{style.name}</Chip>
            ))}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            collections
            <Section.Info>
              <Section.InfoHeader>
                The collections that feature the product.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A collection is an arbitrary grouping of products, typically
                done by a brand or a designer. Often, collections are created
                entirely by a single designer.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {product.collections.map((collection) => (
              <Chip key={collection.id}>{collection.name}</Chip>
            ))}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            designers
            <Section.Info>
              <Section.InfoHeader>
                The product’s designers. Typically, this will be a single
                person.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A designer is a person who contributed to the design of a
                product.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {product.designers.map((designer) => (
              <Chip key={designer.id}>{designer.name}</Chip>
            ))}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            brands
            <Section.Info>
              <Section.InfoHeader>
                The product’s brands. Collaborations can have multiple brands.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A brand is a recognizable name. Brands with similar names are
                given tiers. e.g. GUESS is given tier 1 while GBG and GUESS
                FACTORY are given tier 2.
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {product.brands.map((brand) => (
              <Chip key={brand.id}>{brand.name}</Chip>
            ))}
          </Section.Content>
        </Section>
        <Section>
          <Section.Title>
            prices
            <Section.Info>
              <Section.InfoHeader>
                The product’s available prices (MSRP, retail, resale) per size
                and color.
              </Section.InfoHeader>
              <Section.InfoDetail>
                A price is an encapsulation of a product’s value. A price can be
                for all the sizes and color variants of a product (e.g. when
                being sold at retail value) or specific to a single size and
                color variant (e.g. GOAT, Ebay, StockX).
              </Section.InfoDetail>
            </Section.Info>
          </Section.Title>
          <Section.Content>
            {product.brands.map((brand) => (
              <Chip key={brand.id}>{brand.name}</Chip>
            ))}
          </Section.Content>
        </Section>
      </article>
    </div>
  )
}

function Section({ children }: PropsWithChildren) {
  return <section>{children}</section>
}

Section.Title = function SectionTitle({ children }: PropsWithChildren) {
  return <h2 className='mb-1 flex items-center gap-1'>{children}</h2>
}

Section.Info = function SectionInfo({ children }: PropsWithChildren) {
  return (
    <Popover.Root>
      <Popover.Trigger className='mb-0.5 text-gray-400 aria-expanded:text-gray-600 dark:text-gray-600 aria-expanded:dark:text-gray-400'>
        <Info className='w-3 h-3' />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          collisionPadding={10}
          side='bottom'
          sideOffset={4}
          asChild
        >
          <article className='frosted max-w-sm rounded border border-gray-200 p-3 text-2xs shadow-lg dark:border-gray-800'>
            {children}
          </article>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

Section.InfoHeader = function InfoHeader({ children }: PropsWithChildren) {
  return <h3>{children}</h3>
}

Section.InfoDetail = function InfoDetail({ children }: PropsWithChildren) {
  return <p className='text-gray-600 dark:text-gray-400'>{children}</p>
}

Section.Content = function SectionContent({ children }: PropsWithChildren) {
  return <div className='flex flex-wrap gap-1'>{children}</div>
}

function Chip({ children }: PropsWithChildren) {
  return (
    <div className='rounded border border-gray-200 bg-gray-50 px-1 py-0.5 text-2xs dark:border-gray-800 dark:bg-gray-900'>
      {children}
    </div>
  )
}
