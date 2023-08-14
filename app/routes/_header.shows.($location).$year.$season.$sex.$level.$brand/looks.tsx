import { Link, useFetchers, useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { Check, Bookmark, Plus } from 'lucide-react'
import { useCallback } from 'react'

import { type action as saveAPI } from 'routes/api.looks.$lookId.save'
import { type action as createAPI } from 'routes/api.looks.$lookId.save.create'

import {
  Combobox,
  type ComboboxItemProps,
  type ComboboxEmptyProps,
} from 'components/combobox'
import { Button, buttonVariants } from 'components/ui/button'
import { CommandItem } from 'components/ui/command'

import { cn } from 'utils/cn'
import { useOptionalUser, useRedirectTo } from 'utils/general'

import { type loader } from './route'

// Eagerly load images for the first three rows of looks (above the fold).
const rowsToEagerLoad = 3

// How many looks are shown in each row of results.
const looksPerRow = 2

export function Looks() {
  const show = useLoaderData<typeof loader>()
  return (
    <ol
      className='grid gap-x-2 gap-y-6'
      style={{
        gridTemplateColumns: `repeat(${looksPerRow}, minmax(0, 1fr))`,
      }}
    >
      {show.looks.map((look) => (
        <LookItem key={look.id} look={look} />
      ))}
    </ol>
  )
}

type Look = SerializeFrom<typeof loader>['looks'][number]
type Set = Look['sets'][number]

function LookItem({ look }: { look: Look }) {
  const index = look.number - 1
  return (
    <li>
      <div className='bg-gray-100 dark:bg-gray-900 aspect-person'>
        {look.images.length > 0 && (
          <img
            className='object-cover h-full w-full'
            loading={index < looksPerRow * rowsToEagerLoad ? 'eager' : 'lazy'}
            decoding={index < looksPerRow * rowsToEagerLoad ? 'sync' : 'async'}
            src={look.images[0].url}
            alt=''
          />
        )}
      </div>
      <div className='flex justify-between items-center mt-1'>
        <p className='text-sm'>Look {look.number}</p>
        <SaveButton look={look} />
      </div>
    </li>
  )
}

function SaveButton({ look }: { look: Look }) {
  const user = useOptionalUser()
  const redirectTo = useRedirectTo()
  return user ? (
    <SaveMenu look={look} />
  ) : (
    <Link
      className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      to={`/login?redirectTo=${redirectTo}`}
      prefetch='intent'
    >
      <Bookmark className='w-3 h-3' />
    </Link>
  )
}

function SaveMenu({ look }: { look: Look }) {
  const fetchers = useFetchers()
  const action = `/api/looks/${look.id}/save`
  const create = `/api/looks/${look.id}/save/create`

  // If you look at the loader function for this page, you'll notice that I
  // query for the sets that this look is included in that were authored by the
  // current user. If this length is greater than zero, then it is bookmarked.
  const creating = fetchers.filter((f) => f.formAction === create)
  const removing = fetchers
    .filter((f) => f.formAction === action && f.formMethod === 'DELETE')
    .map((f) => Number(f.formData?.get('setId')))
  const adding = fetchers
    .filter((f) => f.formAction === action && f.formMethod === 'POST')
    .map((f) => Number(f.formData?.get('setId')))
  const current = new Set(look.sets ? look.sets.map((s) => s.id) : [])
  removing.forEach((id) => current.delete(id))
  adding.forEach((id) => current.add(id))
  const isSaved = current.size > 0 || creating.length > 0

  const item = useCallback(
    ({ item: set }: ComboboxItemProps<Set>) => (
      <SelectItem key={set.id} set={set} look={look} action={action} />
    ),
    [look, action],
  )
  const empty = useCallback(
    ({ search }: ComboboxEmptyProps) => (
      <CreateItem name={search.trim()} action={create} />
    ),
    [create],
  )

  return (
    <Combobox
      placeholder='Search sets...'
      initialItems={look.sets}
      item={item}
      empty={empty}
      endpoint='/api/sets'
      className='w-60'
    >
      <Button size='icon' variant='ghost'>
        <Bookmark
          className={cn(
            'w-3 h-3',
            isSaved && 'fill-gray-900 dark:fill-gray-100',
          )}
        />
      </Button>
    </Combobox>
  )
}

function CreateItem({ name, action }: { name: string; action: string }) {
  const fetcher = useFetcher<typeof createAPI>()
  return (
    <CommandItem
      value={name}
      disabled={fetcher.state !== 'idle'}
      onSelect={() => fetcher.submit({ name }, { action, method: 'POST' })}
    >
      <Plus className='mr-2 h-4 w-4 flex-none' />
      <span className='flex gap-1 truncate'>
        <span className='flex-none'>Create new set:</span>
        <span className='text-gray-400 dark:text-gray-600 truncate'>
          “{name}”
        </span>
      </span>
    </CommandItem>
  )
}

function SelectItem({
  set,
  look,
  action,
}: {
  set: Set
  look: Look
  action: string
}) {
  const fetcher = useFetcher<typeof saveAPI>()
  const active =
    fetcher.state === 'idle'
      ? look.sets.some((s) => s.id === set.id)
      : fetcher.formMethod === 'POST'
  return (
    <CommandItem
      value={set.name}
      onSelect={() =>
        fetcher.submit(
          { setId: set.id },
          { method: active ? 'DELETE' : 'POST', action },
        )
      }
    >
      <Check
        className={cn(
          'mr-2 h-4 w-4 flex-none',
          active ? 'opacity-100' : 'opacity-0',
        )}
      />
      <span className='truncate'>{set.name}</span>
    </CommandItem>
  )
}
