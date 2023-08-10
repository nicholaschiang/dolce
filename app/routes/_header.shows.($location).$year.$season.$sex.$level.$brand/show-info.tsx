import { useLoaderData } from '@remix-run/react'
import { type PropsWithChildren } from 'react'

import { ExternalLink } from 'components/external-link'

import { cn } from 'utils/cn'
import { LOCATION_TO_NAME } from 'utils/location'

import { type loader } from './route'
import { Section } from './section'

export function ShowInfo() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header='Show info' id='show-info'>
      {show.description != null && (
        <article
          className='prose dark:prose-invert max-w-none'
          dangerouslySetInnerHTML={{ __html: show.description }}
        />
      )}
      <dl className='mt-2'>
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
      </dl>
    </Section>
  )
}

function InfoItem({
  label,
  className,
  children,
}: PropsWithChildren<{ label: string; className?: string }>) {
  return (
    <div className='flex gap-1 items-center'>
      <dt className='flex-none font-semibold'>{label}:</dt>
      <dd className={cn('w-0 flex-1 truncate', className)}>{children}</dd>
    </div>
  )
}
