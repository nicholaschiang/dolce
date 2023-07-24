import { useLoaderData } from '@remix-run/react'

import { Avatar } from 'components/avatar'
import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'

import { type loader } from './route'
import { Section } from './section'

export function Designers() {
  const show = useLoaderData<typeof loader>()
  const designers = show.collections.flatMap((c) => c.designers)
  return (
    <Section
      header={designers.length === 1 ? 'Designer' : 'Designers'}
      id='designers'
    >
      {designers.length === 0 && (
        <Empty className='mt-2'>
          No designers have claimed this show yet. Please check back later.
        </Empty>
      )}
      {designers.length > 0 && (
        <ul className='mt-2 grid gap-2'>
          {designers.map((designer) => (
            <li key={designer.id}>
              <Avatar src={designer} />
              <h3 className='flex items-center group gap-1'>
                {designer.name}
                {designer.url != null && (
                  <ExternalLink
                    className='group-hover:opacity-100 opacity-0 transition-opacity text-gray-400 dark:text-gray-600'
                    href={designer.url}
                  />
                )}
              </h3>
              {designer.description != null && (
                <article
                  className='prose prose-sm dark:prose-invert'
                  dangerouslySetInnerHTML={{ __html: designer.description }}
                />
              )}
              {designer.description == null && (
                <Empty>
                  No designer description to show yet. Please check back later.
                </Empty>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
