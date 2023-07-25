import { useLoaderData } from '@remix-run/react'
import { type PropsWithChildren } from 'react'

import { ExternalLink } from 'components/external-link'

import { cn } from 'utils/cn'

import { type loader } from './route'
import { Section } from './section'

export function ShowInfo() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header='Show info' id='show-info'>
      <article
        className='prose dark:prose-invert max-w-none'
        dangerouslySetInnerHTML={{ __html: show.description }}
      />
      <dl className='mt-2'>
        <InfoItem label='Date'>
          {new Date(show.date).toLocaleDateString(undefined, {
            dateStyle: 'long',
          })}
        </InfoItem>
        {show.location != null && (
          <InfoItem label='Location'>{show.location}</InfoItem>
        )}
        <InfoItem label='Looks'>{show.looks.length}</InfoItem>
        <InfoItem
          label={show.brands.length === 1 ? 'Brand' : 'Brands'}
          className='inline-flex gap-1'
        >
          {show.brands.map((brand) =>
            brand.url ? (
              <ExternalLink key={brand.id} href={brand.url}>
                {brand.name}
              </ExternalLink>
            ) : (
              <span key={brand.id}>{brand.name}</span>
            ),
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
