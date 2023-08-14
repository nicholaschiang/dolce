import { useFetcher } from '@remix-run/react'
import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react'

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
import { uniq } from 'utils/general'

export type ComboboxEmptyProps = { search: string }
export type ComboboxItemProps<T> = { item: T }
export type ComboboxProps<T> = {
  endpoint: string
  initialItems?: T[]
  item: (props: ComboboxItemProps<T>) => ReactNode
  empty: (props: ComboboxEmptyProps) => ReactNode
  children: JSX.Element
  placeholder: string
  className?: string
}

const unique = (item: { id: string | number }) => item.id

/**
 * A combobox component that fetches items from an API endpoint.
 * @param endpoint The API endpoint to fetch items from. Should accept a
 * `search` query parameter that filters items by their name.
 * @param initialItems The initial items to show until the API has loaded.
 * @param item The function that renders an item.
 * @param children The combobox trigger.
 * @param className An optional class name to apply to the combobox content.
 */
export function Combobox<T extends { id: string | number; name: string }>({
  endpoint,
  initialItems,
  item,
  empty,
  placeholder,
  children,
  className,
}: ComboboxProps<T>) {
  // Load additional items based on the search query but don't remove any of the
  // older items. CMD-K will handle the text-based filtering for me. I just have
  // to ensure that the most relevant items are included in the results list
  // (e.g. when there are 1000+ items we have to apply some db-level filters but
  // we want to still rely on frontend-level filters for instant reactivity).
  const fetcher = useFetcher<T[]>()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<T[]>(() =>
    uniq([...((fetcher.data ?? []) as T[]), ...(initialItems ?? [])], unique),
  )
  useEffect(() => {
    setItems((prev) =>
      fetcher.data ? uniq([...prev, ...(fetcher.data as T[])], unique) : prev,
    )
  }, [fetcher.data])

  // Refresh the search results after every keystroke (every few ms).
  const [search, setSearch] = useState('')
  const loaded = useRef('')
  const path = `${endpoint}?search=${encodeURIComponent(search)}`
  const load = useCallback(() => {
    if (loaded.current !== path) {
      fetcher.load(path)
      loaded.current = path
    }
  }, [fetcher, path])
  useEffect(() => {
    const timeoutId = setTimeout(open ? load : () => {}, 50)
    return () => clearTimeout(timeoutId)
  }, [open, load])

  // I cannot rely on the CMD-K filtering and sorting as I want to show a
  // "create new set" item when there are no results.
  const results = items
    .map((set) => ({ ...set, score: commandScore(set.name, search) }))
    .filter((set) => set.score > 0)
    .sort((a, b) => b.score - a.score)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onMouseOver={load} asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-60 p-0', className)}
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
              {results.map((result) => item({ item: result }))}
              {results.length === 0 && empty({ search })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
