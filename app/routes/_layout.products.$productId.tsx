import * as Popover from '@radix-ui/react-popover'
import { Link, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import {
  type LoaderArgs,
  type SerializeFrom,
  type V2_MetaFunction,
} from '@vercel/remix'
import { ChevronDown, ChevronUp, X, Info } from 'lucide-react'
import { type PropsWithChildren, type ReactNode } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import invariant from 'tiny-invariant'

import type { loader as products } from 'routes/_layout.products'

import { Dialog } from 'components/dialog'
import { Image } from 'components/image'
import { Tooltip } from 'components/tooltip'

import { NAME, useData } from 'utils/general'

import { prisma } from 'db.server'
import { type Handle } from 'root'

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.name ?? '404'} | ${NAME}` },
]

export const handle: Handle = {
  breadcrumb: (match) => ({
    to: `/products/${match.params.productId as string}`,
    children: (match.data as SerializeFrom<typeof loader>)?.name ?? '404',
  }),
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.productId, 'productId is required')
  const id = Number(params.productId)
  if (Number.isNaN(id))
    throw new Response('productId must be a number', { status: 400 })
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      sizes: true,
      variants: { include: { images: true, prices: true } },
      styles: true,
      collections: true,
      designers: true,
      brands: true,
    },
  })
  if (product === null) throw new Response('Not Found', { status: 404 })
  return product
}

// Images are currently sized w:h = 1:1.25 (e.g. Isabel Marant).
const widthToHeightImageRatio = 1.25

type LinkWithHotkeyProps = {
  to: string
  tip: string
  hotkey: string
  disabled: boolean
  children: ReactNode
}

function LinkWithHotkey({
  to,
  tip,
  hotkey,
  disabled,
  children,
}: LinkWithHotkeyProps) {
  const nav = useNavigate()
  if (disabled)
    return (
      <button type='button' className='icon-button square outlined' disabled>
        {children}
      </button>
    )
  return (
    <Tooltip tip={tip} hotkey={hotkey} onHotkey={() => nav(to)}>
      <Link to={to} className='icon-button square outlined' prefetch='intent'>
        {children}
      </Link>
    </Tooltip>
  )
}

export default function ProductPage() {
  const nav = useNavigate()
  const location = useLocation()
  const data = useData<typeof products>('routes/_layout.products')
  const productIds = (data?.products ?? []).map((product) => product.id)
  const product = useLoaderData<typeof loader>()
  const productIndex = productIds.indexOf(product.id)
  useHotkeys(
    'g',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      nav(`../${productIds[0]}${location.search}`)
    },
    [nav, productIds, location.search],
  )
  useHotkeys(
    'shift+G',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      nav(`../${productIds[productIds.length - 1]}${location.search}`)
    },
    [nav, productIds, location.search],
  )
  const images = product.variants.map((v) => v.images).flat()
  return (
    <Dialog
      open
      onOpenChange={() => nav(`..${location.search}`)}
      onOpenAutoFocus={(event) => event.preventDefault()}
      className='w-full max-w-screen-lg'
    >
      <div className='flex items-center gap-2.5 border-b border-gray-200/50 bg-gray-50 p-2 px-6 dark:border-gray-800/50 dark:bg-gray-900'>
        <Tooltip tip='close' hotkey='esc'>
          <Dialog.Close className='icon-button square'>
            <X className='w-3 h-3' />
          </Dialog.Close>
        </Tooltip>
        <div className='flex items-center gap-1'>
          <LinkWithHotkey
            tip='move up'
            hotkey='k'
            to={`../${productIds[productIndex - 1]}${location.search}`}
            disabled={productIndex <= 0}
          >
            <ChevronUp className='w-3 h-3' />
          </LinkWithHotkey>
          <LinkWithHotkey
            tip='move down'
            hotkey='j'
            to={`../${productIds[productIndex + 1]}${location.search}`}
            disabled={productIndex === productIds.length - 1}
          >
            <ChevronDown className='w-3 h-3' />
          </LinkWithHotkey>
        </div>
        <span className='mt-0.5 text-sm text-gray-600 dark:text-gray-400'>
          {productIndex + 1}
          <span className='text-gray-400 dark:text-gray-600'>
            {' / '}
            {productIds.length}
          </span>
        </span>
      </div>
      <div className='flex w-full items-start gap-6 p-6'>
        <div className='relative w-0 flex-1'>
          <div
            className='absolute w-full'
            style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
          >
            <Image
              className='absolute top-0 h-full w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900'
              loading='eager'
              decoding='sync'
              src={images[0].url}
              responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
                (width) => ({
                  size: { width, height: width * widthToHeightImageRatio },
                  maxWidth: width * 2,
                }),
              )}
            />
          </div>
          <div
            className='relative z-30 mb-2 rounded-md'
            style={{ paddingTop: `${widthToHeightImageRatio * 100}%` }}
          />
        </div>
        <article className='flex w-0 flex-1 flex-col gap-3'>
          <Section>
            <p className='text-sm text-gray-400 dark:text-gray-600'>
              {product.level}
            </p>
            <Dialog.Title className='text-2xl'>{product.name}</Dialog.Title>
            <p className='text-2xs'>{product.description}</p>
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
              {product.sizes.map((size) => (
                <Chip key={size.id}>{size.name}</Chip>
              ))}
            </Section.Content>
          </Section>
          <Section>
            <Section.Title>
              variants
              <Section.Info>
                <Section.InfoHeader>
                  The variants the product was originally made in.
                </Section.InfoHeader>
                <Section.InfoDetail>
                  A variant is a specific colorway of a product. Variants are
                  product-specific.
                </Section.InfoDetail>
              </Section.Info>
            </Section.Title>
            <Section.Content>
              {product.variants.map((variant) => (
                <Chip key={variant.id}>{variant.name}</Chip>
              ))}
            </Section.Content>
          </Section>
          <Section>
            <Section.Title>
              styles
              <Section.Info>
                <Section.InfoHeader>
                  The product’s styles. Allegorical to labels (e.g. top,
                  t-shirt, v-neck).
                </Section.InfoHeader>
                <Section.InfoDetail>
                  A product style category is a high-level grouping of products.
                  Styles are a tad bit reminiscent of the typical issue tracking
                  tool’s “labels” feature. e.g. blazer, bomber, cardigan,
                  quilted, raincoat, jeans, tuxedos, etc.
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
                  A price is an encapsulation of a product’s value. A price can
                  be for all the sizes and color variants of a product (e.g.
                  when being sold at retail value) or specific to a single size
                  and color variant (e.g. GOAT, Ebay, StockX).
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
    </Dialog>
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
