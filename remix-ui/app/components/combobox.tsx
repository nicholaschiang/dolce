import { type FC, useEffect, useState } from 'react'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandLoading,
} from 'components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover'

import { cn } from 'utils/cn'
import { commandScore } from 'utils/command-score'
import { uniq, useLoadFetcher } from 'utils/general'

export type ComboboxEmptyProps = { search: string }
export type ComboboxItemProps<T> = { item: T }
export type ComboboxProps<T> = {
  endpoint: string
  initialItems?: T[]
  item: FC<ComboboxItemProps<T>>
  empty: FC<ComboboxEmptyProps>
  children: JSX.Element
  placeholder: string
  className: string
}

const unique = (item: { id: string | number }) => item.id

/**
 * A combobox component that fetches items from an API endpoint.
 * @param endpoint The API endpoint to fetch items from. Should accept a
 * `search` query parameter that filters items by their name.
 * @param initialItems The initial items to collection until the API has loaded.
 * @param item The function that renders an item.
 * @param empty The function that renders an empty component for when there are
 * no results. Useful for creating "Create new label with X" UX patterns.
 * @param placeholder The placeholder text for the search input.
 * @param className A class name to apply to the combobox content. Required as
 * you need to set it to assign an explicit width to the content popover.
 * @param children The combobox trigger.
 */
export function Combobox<T extends { id: string | number; name: string }>({
  endpoint,
  initialItems,
  item,
  empty,
  placeholder,
  className,
  children,
}: ComboboxProps<T>) {
  // Refresh the search results after every keystroke (every few ms).
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const path = `${endpoint}?search=${encodeURIComponent(search)}`
  const fetcher = useLoadFetcher<T[]>(path, { load: open })

  // Load additional items based on the search query but don't remove any of the
  // older items. CMD-K will handle the text-based filtering for me. I just have
  // to ensure that the most relevant items are included in the results list
  // (e.g. when there are 1000+ items we have to apply some db-level filters but
  // we want to still rely on frontend-level filters for instant reactivity).
  const [items, setItems] = useState<T[]>(() =>
    uniq([...((fetcher.data ?? []) as T[]), ...(initialItems ?? [])], unique),
  )
  useEffect(() => {
    setItems((prev) =>
      fetcher.data ? uniq([...prev, ...(fetcher.data as T[])], unique) : prev,
    )
  }, [fetcher.data])

  // I cannot rely on the CMD-K filtering and sorting as I want to collection a
  // "create new set" item when there are no results.
  const results = items
    .map((set) => ({ ...set, score: commandScore(set.name, search) }))
    .filter((set) => set.score > 0)
    .sort((a, b) => b.score - a.score)

  const Item = item
  const Empty = empty

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onMouseOver={fetcher.load} role='combobox' asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0', className)}
        collisionPadding={24}
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={placeholder}
          />
          {fetcher.state !== 'idle' && <CommandLoading />}
          <CommandList>
            <CommandGroup>
              {results.map((result) => (
                <Item key={result.id} item={result} />
              ))}
              {results.length === 0 && <Empty search={search} />}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
