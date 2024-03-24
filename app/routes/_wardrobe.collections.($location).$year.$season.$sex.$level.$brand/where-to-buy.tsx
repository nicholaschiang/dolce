import { useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'
import { LayoutSection } from 'components/layout'
import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'

import { type loader } from './route'

export function WhereToBuy() {
  const collection = useLoaderData<typeof loader>()
  if (collection.links.length === 0) return null
  return (
    <LayoutSection header='Where to buy' id='where-to-buy'>
      {collection.links.length === 0 && (
        <Empty className='mt-2'>
          <p>
            There are no direct links to this collection on retailer or brand
            websites.
          </p>
          {collection.brand.url != null && (
            <p>
              You can try browsing the{' '}
              <span>
                <ExternalLink href={collection.brand.url}>
                  {collection.brand.name}
                </ExternalLink>
              </span>{' '}
              website to find these items.
            </p>
          )}
        </Empty>
      )}
      {collection.links.length > 0 && (
        <ul className='mt-2 flex gap-2'>
          {collection.links.map((link) => (
            <li key={link.id}>
              <BuyLink
                avatar={(link.brand ?? link.retailer)?.avatar}
                alt={(link.brand ?? link.retailer ?? collection)?.name}
                url={link.url}
              />
            </li>
          ))}
        </ul>
      )}
    </LayoutSection>
  )
}

function BuyLink({
  avatar,
  alt,
  url,
}: {
  avatar?: string | null
  alt: string
  url: string
}) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(buttonVariants({ variant: 'outline' }), 'h-auto')}
    >
      {avatar != null && <img className='dark:invert' src={avatar} alt={alt} />}
      {avatar == null && alt}
    </a>
  )
}
