import { useLoaderData } from '@remix-run/react'

import { ExternalLink } from 'components/external-link'
import { Info, InfoItem } from 'components/info'
import { LayoutSection } from 'components/layout'
import { Prose } from 'components/prose'

import { LOCATION_TO_NAME } from 'utils/location'

import { type loader } from './route'

export function Properties() {
  const collection = useLoaderData<typeof loader>()
  return (
    <LayoutSection header='Properties' id='properties'>
      {collection.description != null && (
        <Prose content={collection.description} />
      )}
      <Info>
        {collection.date != null && (
          <InfoItem label='Date'>
            {new Date(collection.date).toLocaleDateString(undefined, {
              dateStyle: 'long',
            })}
          </InfoItem>
        )}
        {collection.location != null && (
          <InfoItem label='Location'>
            {LOCATION_TO_NAME[collection.location]}
          </InfoItem>
        )}
        <InfoItem label='Looks'>{collection.looks.length}</InfoItem>
        <InfoItem label='Brand' className='inline-flex gap-1'>
          {collection.brand.url ? (
            <ExternalLink key={collection.brand.id} href={collection.brand.url}>
              {collection.brand.name}
            </ExternalLink>
          ) : (
            <span key={collection.brand.id}>{collection.brand.name}</span>
          )}
        </InfoItem>
        <InfoItem label='URL'>
          <ExternalLink href={collection.url}>
            {new URL(collection.url).hostname}
          </ExternalLink>
        </InfoItem>
      </Info>
    </LayoutSection>
  )
}
