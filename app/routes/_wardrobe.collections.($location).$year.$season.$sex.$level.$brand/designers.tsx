import { useFetcher, useFetchers, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { type action as updateAPI } from 'routes/api.collections.$collectionId.designers'
import { type loader as searchAPI } from 'routes/api.designers'

import { Avatar } from 'components/avatar'
import { Combobox, type ComboboxItemProps } from 'components/combobox'
import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'
import { LayoutSection } from 'components/layout'
import { Prose } from 'components/prose'
import { Button } from 'components/ui/button'
import { CommandItem, CommandEmpty } from 'components/ui/command'

import { cn } from 'utils/cn'
import { useOptionalUser } from 'utils/general'

import { type loader } from './route'

export function Designers() {
  const collection = useLoaderData<typeof loader>()
  const user = useOptionalUser()
  if (collection.designers.length === 0 && !user?.curator) return null
  return (
    <LayoutSection
      header={collection.designers.length === 1 ? 'Designer' : 'Designers'}
      id='designers'
    >
      {collection.designers.length > 0 && (
        <ul className='mt-2 grid gap-2'>
          {collection.designers.map((designer) => (
            <DesignerListItem key={designer.id} designer={designer} />
          ))}
        </ul>
      )}
      {collection.designers.length === 0 && <DesignerSelect />}
    </LayoutSection>
  )
}

function DesignerSelect() {
  return (
    <Combobox
      endpoint='/api/designers'
      placeholder='Select designer...'
      item={DesignerItem}
      empty={EmptyItem}
      className='w-60'
    >
      <Button variant='outline' className='w-60 justify-between'>
        Select designer
        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      </Button>
    </Combobox>
  )
}

type SearchResult = SerializeFrom<typeof searchAPI>[number]

function DesignerItem({ item: designer }: ComboboxItemProps<SearchResult>) {
  const fetcher = useFetcher<typeof updateAPI>()
  const collection = useLoaderData<typeof loader>()
  const action = `/api/collections/${collection.id}/designers`
  const fetchers = useFetchers().filter((f) => f.formAction === action)
  return (
    <CommandItem
      value={designer.name}
      onSelect={() =>
        fetcher.submit({ designerId: designer.id }, { method: 'POST', action })
      }
      className={cn('truncate', fetcher.state !== 'idle' && 'cursor-wait')}
      disabled={fetchers.length > 0}
    >
      {designer.name}
    </CommandItem>
  )
}

function EmptyItem() {
  return <CommandEmpty>No results</CommandEmpty>
}

type Designer = SerializeFrom<typeof loader>['designers'][number]

function DesignerListItem({ designer }: { designer: SerializeFrom<Designer> }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <li className='rounded-md shadow-sm p-4 flex gap-4 border border-gray-200 dark:border-gray-800'>
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
        {designer.articles.length > 0 && (
          <div
            className={cn(
              'relative overflow-hidden',
              !expanded && 'h-0 flex-1',
            )}
          >
            <Prose content={designer.articles[0].content} />
            <button
              className={cn(
                'w-full text-sm mt-2 underline',
                !expanded &&
                  'absolute inset-x-0 bottom-0 pt-10 bg-gradient-to-t from-white dark:from-gray-950 to-transparent',
              )}
              type='button'
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Collection less' : 'Collection more'}
            </button>
          </div>
        )}
        {designer.articles.length === 0 && (
          <Empty className='py-2 mt-2'>
            No designer articles to show yet. Please check back later.
          </Empty>
        )}
      </div>
    </li>
  )
}
