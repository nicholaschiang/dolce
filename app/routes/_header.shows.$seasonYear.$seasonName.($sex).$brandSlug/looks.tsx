import { useFetchers, useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { Check, Bookmark } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { type action as saveAPI } from 'routes/api.looks.$lookId.save'
import { type loader as setsAPI } from 'routes/api.sets'

import { Button } from 'components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLoading,
} from 'components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'

import { uniq } from 'utils'
import { cn } from 'utils/cn'

import { type loader } from './route'

// Eagerly load images for the first three rows of looks (above the fold).
const rowsToEagerLoad = 3

// How many looks are shown in each row of results.
const looksPerRow = 2

export function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
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
    </div>
  )
}

type Look = SerializeFrom<typeof loader>['looks'][number]
type Set = Look['sets'][number]

function LookItem({ look }: { look: Look }) {
  const index = look.number - 1
  const fetchers = useFetchers()
  const action = `/api/looks/${look.id}/save`

  // If you look at the loader function for this page, you'll notice that I
  // query for the sets that this look is included in that were authored by the
  // current user. If this length is greater than zero, then it is bookmarked.
  const removing = fetchers
    .filter((f) => f.formAction === action && f.formMethod === 'DELETE')
    .map((f) => Number(f.formData?.get('setId')))
  const adding = fetchers
    .filter((f) => f.formAction === action && f.formMethod === 'POST')
    .map((f) => Number(f.formData?.get('setId')))
  const current = new Set(look.sets ? look.sets.map((s) => s.id) : [])
  removing.forEach((id) => current.delete(id))
  adding.forEach((id) => current.add(id))
  const isSaved = current.size > 0

  // Load additional items based on the search query but don't remove any of the
  // older items. CMD-K will handle the text-based filtering for me. I just have
  // to ensure that the most relevant items are included in the results list
  // (e.g. when there are 1000+ items we have to apply some db-level filters but
  // we want to still rely on frontend-level filters for instant reactivity).
  const fetcher = useFetcher<typeof setsAPI>()
  const [open, setOpen] = useState(false)
  const [sets, setSets] = useState(() =>
    uniq([...(fetcher.data ?? []), ...(look.sets ?? [])], (s) => s.id),
  )
  useEffect(() => {
    setSets((prev) =>
      fetcher.data ? uniq([...prev, ...fetcher.data], (s) => s.id) : prev,
    )
  }, [fetcher.data])

  // Refresh the search results after every keystroke (every few ms).
  const [search, setSearch] = useState('')
  const loaded = useRef('')
  useEffect(() => {
    const endpoint = `/api/sets?search=${encodeURIComponent(search)}`
    const timeoutId = setTimeout(() => {
      if (loaded.current !== endpoint) {
        fetcher.load(endpoint)
        loaded.current = endpoint
      }
    }, 50)
    return () => clearTimeout(timeoutId)
  }, [fetcher, search])

  return (
    <li>
      <div className='bg-gray-100 dark:bg-gray-900 aspect-person'>
        <img
          className='object-cover h-full w-full'
          loading={index < looksPerRow * rowsToEagerLoad ? 'eager' : 'lazy'}
          decoding={index < looksPerRow * rowsToEagerLoad ? 'sync' : 'async'}
          src={look.images[0]?.url}
          alt=''
        />
      </div>
      <div className='flex justify-between items-center mt-1'>
        <p className='text-sm'>Look {look.number}</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size='icon' variant='ghost'>
              <Bookmark
                className={cn(
                  'w-3 h-3',
                  isSaved && 'fill-gray-900 dark:fill-gray-100',
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-60 p-0'
            align='start'
            collisionPadding={24}
          >
            <Command>
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder='Search sets...'
              />
              <CommandEmpty>No sets found.</CommandEmpty>
              <CommandGroup>
                {sets.map((set) => (
                  <SetItem key={set.id} set={set} look={look} action={action} />
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  )
}

function SetItem({
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
