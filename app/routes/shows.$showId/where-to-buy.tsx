import { useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'
import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'

import { type loader } from './route'
import { Section } from './section'

export function WhereToBuy() {
  const show = useLoaderData<typeof loader>()
  const links = show.collections.flatMap((collection) => collection.links)
  const brands = show.brands.filter((brand) => brand.url)
  if (links.length === 0) return null
  return (
    <Section header='Where to buy' id='where-to-buy'>
      {links.length === 0 && (
        <Empty className='mt-2'>
          <p>
            There are no direct links to this collection on retailer or brand
            websites.
          </p>
          {brands.length > 0 && (
            <p>
              You can try browsing the{' '}
              {brands.map((brand, index) => (
                <span>
                  {index !== 0 && ', '}
                  <ExternalLink href={brand.url ?? ''}>
                    {brand.name}
                  </ExternalLink>
                </span>
              ))}{' '}
              website to find these items.
            </p>
          )}
        </Empty>
      )}
      {links.length > 0 && (
        <ul className='mt-2 flex gap-2'>
          {links.map((link) => (
            <li key={link.id}>
              <BuyLink
                avatar={(link.brand ?? link.retailer)?.avatar}
                alt={(link.brand ?? link.retailer ?? show)?.name}
                url={link.url}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
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
