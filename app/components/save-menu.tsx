import { type Board } from '@prisma/client'
import { useFetchers, useFetcher } from '@remix-run/react'
import { Check, Bookmark, Plus } from 'lucide-react'
import { useCallback, forwardRef } from 'react'

import { type action as saveAPI } from 'routes/api.looks.$lookId.save'
import { type action as createAPI } from 'routes/api.looks.$lookId.save.create'

import {
  Combobox,
  type ComboboxItemProps,
  type ComboboxEmptyProps,
} from 'components/combobox'
import { Button, type ButtonProps } from 'components/ui/button'
import { CommandItem } from 'components/ui/command'

import { cn } from 'utils/cn'
import { type Serialize } from 'utils/general'

type SaveMenuProps = {
  sets?: Serialize<Board>[]
  saveAPI: string
  createAPI: string
} & Omit<ButtonProps, 'children' | 'ref'>

const SaveMenu = forwardRef<HTMLButtonElement, SaveMenuProps>(
  ({ sets, saveAPI: action, createAPI: create, ...etc }, ref) => {
    const fetchers = useFetchers()

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
    const current = new Set(sets ? sets.map((s) => s.id) : [])
    removing.forEach((id) => current.delete(id))
    adding.forEach((id) => current.add(id))
    const isSaved = current.size > 0 || creating.length > 0

    const item = useCallback(
      ({ item: set }: ComboboxItemProps<Serialize<Board>>) => (
        <SelectItem key={set.id} set={set} sets={sets ?? []} action={action} />
      ),
      [sets, action],
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
        initialItems={sets}
        item={item}
        empty={empty}
        endpoint='/api/sets'
        className='w-60'
      >
        <Button size='icon' variant='ghost' ref={ref} {...etc}>
          <Bookmark
            className={cn(
              'w-3 h-3',
              isSaved && 'fill-gray-900 dark:fill-gray-100',
            )}
          />
        </Button>
      </Combobox>
    )
  },
)
SaveMenu.displayName = 'SaveMenu'

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
  sets,
  action,
}: {
  set: Serialize<Board>
  sets: Serialize<Board>[]
  action: string
}) {
  const fetcher = useFetcher<typeof saveAPI>()
  const active =
    fetcher.state === 'idle'
      ? sets.some((s) => s.id === set.id)
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

export { SaveMenu }
