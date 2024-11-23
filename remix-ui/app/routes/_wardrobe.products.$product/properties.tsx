import { useLoaderData } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'

import { FilterLink } from 'components/filter-link'
import { Info, InfoItem } from 'components/info'
import { LayoutSection } from 'components/layout'

import { type loader } from './route'
import { useVariant } from './utils'

export function Properties() {
  const product = useLoaderData<typeof loader>()
  const variant = useVariant()
  return (
    <LayoutSection id='properties' header='Properties'>
      <Info>
        <InfoItem label='Slug'>{product.slug}</InfoItem>
        <InfoItem label='Level'>{product.level}</InfoItem>
        <InfoItem label='MSRP'>
          ${(Math.round(Number(product.msrp) * 100) / 100).toFixed(2)}
        </InfoItem>
        <InfoItem label='Styles' className='flex flex-wrap gap-2'>
          {product.styles.map((style) => (
            <FilterLink
              to='/products'
              filters={[
                {
                  id: nanoid(5),
                  name: 'styles',
                  condition: 'some',
                  value: { id: style.id, name: style.name },
                },
                ...product.brands.map((brand) => ({
                  id: nanoid(5),
                  name: 'brands' as const,
                  condition: 'some' as const,
                  value: { id: brand.id, name: brand.name },
                })),
              ]}
              className='block'
              key={style.id}
            >
              {style.name}
              <ExternalLink className='w-3 h-3 inline-block ml-1' />
            </FilterLink>
          ))}
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
  )
}
