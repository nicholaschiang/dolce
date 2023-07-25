import { type User } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { useState } from 'react'

import { Avatar } from 'components/avatar'
import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'

import { cn } from 'utils/cn'

import { type loader } from './route'
import { Section } from './section'

export function Designers() {
  const show = useLoaderData<typeof loader>()
  const designers = show.collections.flatMap((c) => c.designers)
  if (designers.length === 0) return null
  return (
    <Section
      header={designers.length === 1 ? 'Designer' : 'Designers'}
      id='designers'
    >
      <ul className='mt-2 grid gap-2'>
        {designers.map((designer) => (
          <DesignerItem key={designer.id} designer={designer} />
        ))}
      </ul>
    </Section>
  )
}

function DesignerItem({ designer }: { designer: SerializeFrom<User> }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <li className='rounded-md shadow-sm p-4 flex gap-4 border border-gray-200 dark:border-gray-700'>
      <Avatar src={designer} className='h-20 w-20' />
      <div className={cn(!expanded && 'flex flex-1 flex-col h-0 min-h-full')}>
        <h3 className='flex items-center group gap-1 font-medium'>
          {designer.url == null && designer.name}
          {designer.url != null && (
            <ExternalLink
              href={designer.url}
              className='no-underline [&>svg]:opacity-0 [&>svg]:group-hover:opacity-100 [&>svg]:transition-opacity [&>svg]:text-gray-400 dark:[&>svg]:text-gray-600'
            >
              {designer.name}
            </ExternalLink>
          )}
        </h3>
        {designer.description != null && (
          <div
            className={cn(
              'relative overflow-hidden',
              !expanded && 'h-0 flex-1',
            )}
          >
            <article
              className='prose prose-sm dark:prose-invert max-w-none'
              dangerouslySetInnerHTML={{ __html: designer.description }}
            />
            <button
              className={cn(
                'w-full text-sm mt-2 underline',
                !expanded &&
                  'absolute inset-x-0 bottom-0 pt-10 bg-gradient-to-t from-white dark:from-gray-950 to-transparent',
              )}
              type='button'
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        )}
        {designer.description == null && (
          <Empty className='py-2 mt-2'>
            No designer description to show yet. Please check back later.
          </Empty>
        )}
      </div>
    </li>
  )
}
