import { Market, type Price } from '@prisma/client'
import { NavLink, useLoaderData } from '@remix-run/react'
import { type PropsWithChildren } from 'react'

import { LayoutSection } from 'components/layout'
import { Button, buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { type Serialize, caps } from 'utils/general'
import { getColorName } from 'utils/variant'

import { type loader } from './route'
import { useVariant } from './utils'

export function Variants() {
  return (
    <>
      <Colors />
      <Sizes />
      <Prices />
    </>
  )
}

function Colors() {
  const product = useLoaderData<typeof loader>()
  const variant = useVariant()
  const colors = new Set(product.variants.map(getColorName))
  return (
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
              variant={active ?? variantsWithColor[0]}
            />
          )
        })}
      </Options>
    </LayoutSection>
  )
}

function Sizes() {
  const product = useLoaderData<typeof loader>()
  const variant = useVariant()
  const sizes = new Set(product.variants.map((s) => s.size.name))
  return (
    <LayoutSection id='sizes' header='Sizes'>
      <Options>
        {Array.from(sizes).map((size) => {
          const variantsWithSize = product.variants.filter(
            (v) => v.size.name === size,
          )
          // Instead of collectioning information for all variants with the size,
          // we only collection information for variants with the selected color
          // _and_ the size. Users select color first and then size.
          const activeVariants = variantsWithSize.filter(
            (v) => variant == null || getColorName(v) === getColorName(variant),
          )
          // Link to the first variant with a price. This will do nothing
          // when a color has already been selected. But when a color has
          // not yet been selected, we collection the price range of all variants
          // with the given size. Then, when the user clicks on one, we want
          // to redirect to a variant with a price.
          const active =
            activeVariants.find((a) => a.prices.some((p) => p.available)) ??
            activeVariants[0]
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
  )
}

function Prices() {
  const variant = useVariant()
  return (
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
              {price.available ? (
                <p className={getMarketColor(price.market)}>
                  {caps(price.market)}
                </p>
              ) : (
                <p className='text-gray-400 dark:text-gray-500'>Unavailable</p>
              )}
              <h3>{(price.brand ?? price.retailer)?.name}</h3>
              <p>${Math.round(Number(price.value))}</p>
            </a>
          </li>
        ))}
      </Options>
    </LayoutSection>
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
  const available = prices.filter((p) => p.available)
  let lowest = available[0]
  let highest = lowest
  available.forEach((p) => {
    if (lowest == null || Number(p.value) < Number(lowest.value)) lowest = p
    if (highest == null || Number(p.value) > Number(highest.value)) highest = p
  })
  const content = (
    <>
      <h3>{label}</h3>
      {lowest == null || highest == null ? (
        <p className='text-gray-400 dark:text-gray-500'>N/A</p>
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
          replace
        >
          {content}
        </NavLink>
      ) : (
        <Button
          className='flex-col h-auto py-1.5'
          variant='outline'
          size='sm'
          disabled
        >
          {content}
        </Button>
      )}
    </li>
  )
}

function PriceValue({ price }: { price: Serialize<Price> }) {
  return (
    <span className={getMarketColor(price.market)}>
      ${Math.round(Number(price.value))}
    </span>
  )
}

function getMarketColor(market: Market): string {
  return market === Market.PRIMARY
    ? 'text-teal-600 dark:text-teal-500'
    : 'text-amber-600 dark:text-amber-500'
}
