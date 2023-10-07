import { useLoaderData } from '@remix-run/react'

import { ExternalLink } from 'components/external-link'
import { Info, InfoItem } from 'components/info'
import { LayoutSection } from 'components/layout'
import { Prose } from 'components/prose'

import { LOCATION_TO_NAME } from 'utils/location'

import { type loader } from './route'

export function Properties() {
  const show = useLoaderData<typeof loader>()
  return (
    <LayoutSection header='Properties' id='properties'>
      {show.description != null && <Prose content={show.description} />}
      <Info>
        {show.date != null && (
          <InfoItem label='Date'>
            {new Date(show.date).toLocaleDateString(undefined, {
              dateStyle: 'long',
            })}
          </InfoItem>
        )}
        {show.location != null && (
          <InfoItem label='Location'>
            {LOCATION_TO_NAME[show.location]}
          </InfoItem>
        )}
        <InfoItem label='Looks'>{show.looks.length}</InfoItem>
        <InfoItem label='Brand' className='inline-flex gap-1'>
          {show.brand.url ? (
            <ExternalLink key={show.brand.id} href={show.brand.url}>
              {show.brand.name}
            </ExternalLink>
          ) : (
            <span key={show.brand.id}>{show.brand.name}</span>
          )}
        </InfoItem>
        <InfoItem label='URL'>
          <ExternalLink href={show.url}>
            {new URL(show.url).hostname}
          </ExternalLink>
        </InfoItem>
      </Info>
    </LayoutSection>
  )
}
