import type { Prisma } from '@prisma/client'
import * as Popover from '@radix-ui/react-popover'
import { useFetchers } from '@remix-run/react'
import cn from 'classnames'
import { Command, useCommandState } from 'cmdk'
import { X, Plus } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import type {
  Dispatch,
  FormEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
} from 'react'
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import invariant from 'tiny-invariant'

import type { loader as colors } from 'routes/_layout.colors'
import type { loader as seasons } from 'routes/_layout.seasons'
import type { loader as tags } from 'routes/_layout.tags'

import { Dialog } from 'components/dialog'
import { LoadingLine } from 'components/loading-line'
import * as Menu from 'components/menu'
import { Tooltip } from 'components/tooltip'

import { uniq, useData, useLoadFetcher } from 'utils/general'
import {
  type VariantColorFilter,
  type VariantTagFilter,
  getColorFilter,
  getColorName,
  isVariantColorFilter,
  getTagFilter,
  getTagName,
  isVariantTagFilter,
} from 'utils/variant'

import type { Filter, FilterName, FilterValue } from 'filters'
import { filterToStrings } from 'filters'
import type { loader as root } from 'root'

// we need a way to load menu options when filtering based on a model; this
// constant aims to map models to the routes that have loaders to get their
// data. note that this assumes each of these routes' loaders returns an array
// of objects that have at least { id: number; name: string }.
// TODO ensure that all of these routes actually exist and return loader data.
const MODEL_TO_ROUTE: Record<string, string> = {
  Company: '/companies',
  Retailer: '/retailers',
  Brand: '/brands',
  Country: '/countries',
  Style: '/styles',
  Size: '/sizes',
  Price: '/prices',
  Season: '/seasons',
  Show: '/shows',
  User: '/designers',

  // Filters for nested variant relations (each variant has a color and tags are
  // associated with variants instead of products).
  Color: '/colors',
  Tag: '/tags',
}

//////////////////////////////////////////////////////////////////

type FiltersContextT = {
  filters: Filter[]
  addOrUpdateFilter: (filter: Filter) => void
  removeFilter: (filter: Filter) => void
}
const FiltersContext = createContext<FiltersContextT>({
  filters: [],
  addOrUpdateFilter() {},
  removeFilter() {},
})
const MenuContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {})

//////////////////////////////////////////////////////////////////

export type FiltersProps = {
  modelName: string
  hiddenFields?: FilterName[]
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  children?: ReactNode
}

// TODO how do we handle multiple filter items with the same filter name?
export function Filters({
  modelName,
  hiddenFields,
  filters,
  setFilters,
  children,
}: FiltersProps) {
  const addOrUpdateFilter = useCallback(
    (f: Filter) => {
      setFilters((prev) => {
        const idx = prev.findIndex((fd) => fd.id === f.id)
        if (idx < 0) return [...prev, f]
        return [...prev.slice(0, idx), f, ...prev.slice(idx + 1)]
      })
    },
    [setFilters],
  )
  const removeFilter = useCallback(
    (f: Filter) => {
      setFilters((prev) => {
        const idx = prev.findIndex((fd) => fd.id === f.id)
        if (idx < 0) return prev
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
      })
    },
    [setFilters],
  )

  // TODO perhaps refactor this component to simply accept a Prisma data model
  // instead of relying on our own proprietary Remix API routes.
  const data = useData<typeof root>('root')
  const model = data?.models.find((m) => m.name === modelName)
  invariant(model, `Could not find model "${modelName}"`)

  useHotkeys(
    'shift+f',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setFilters([])
    },
    [setFilters],
  )

  // TODO use the Radix Toolbar component here (or wrap the Filters component
  // upstream in the products page with a Radix Toolbar for better a11y).
  return (
    <FiltersContext.Provider
      value={useMemo(
        () => ({ filters, addOrUpdateFilter, removeFilter }),
        [filters, addOrUpdateFilter, removeFilter],
      )}
    >
      <nav className='flex items-center justify-between border-b border-gray-200 px-6 py-2 dark:border-gray-800'>
        <ul className='-mb-1.5 flex flex-wrap'>
          {filters.map((f) =>
            f.name === 'variants' ? (
              <VariantItem key={f.id} filter={f} />
            ) : f.name === 'season' ? (
              <SeasonItem key={f.id} filter={f} />
            ) : (
              <Item key={f.id} filter={f} />
            ),
          )}
          <AddFilterButton model={model} hiddenFields={hiddenFields} />
        </ul>
        {children}
      </nav>
    </FiltersContext.Provider>
  )
}

//////////////////////////////////////////////////////////////////

type ItemProps = { filter: Filter }
type GenericItemProps = {
  name: string
  condition: string
  value: string
  onClick: () => void
}

function GenericItem({ name, condition, value, onClick }: GenericItemProps) {
  return (
    <li className='mr-1.5 mb-1.5 flex h-6 flex-none items-stretch gap-px overflow-hidden rounded border border-gray-200 bg-white last:mr-0 dark:border-none dark:bg-transparent'>
      <ItemButton>{name}</ItemButton>
      <ItemButton className='text-gray-400'>{condition}</ItemButton>
      <ItemButton>{value}</ItemButton>
      <ItemButton
        className='text-gray-400 hover:text-inherit'
        onClick={onClick}
      >
        <X className='w-3 h-3' />
      </ItemButton>
    </li>
  )
}

function Item({ filter }: ItemProps) {
  const { removeFilter } = useContext(FiltersContext)
  const { name, condition, value } = filterToStrings(filter)
  return (
    <GenericItem
      name={name}
      condition={condition}
      value={value}
      onClick={() => removeFilter(filter)}
    />
  )
}

function isSeason(
  filter: FilterValue,
): filter is { name: string; year: number } {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    'name' in filter &&
    typeof filter.name === 'string' &&
    'year' in filter &&
    typeof filter.year === 'number'
  )
}

function SeasonItem({ filter }: ItemProps) {
  const { removeFilter } = useContext(FiltersContext)
  const { name, condition } = filterToStrings(filter)
  if (isSeason(filter.value))
    return (
      <GenericItem
        name={name}
        condition={condition}
        value={`${filter.value.name} ${filter.value.year}`}
        onClick={() => removeFilter(filter)}
      />
    )
  throw new Error(
    `<SeasonItem> expected a season filter value but got: ${JSON.stringify(
      filter.value,
    )}.`,
  )
}

function VariantItem({ filter }: ItemProps) {
  if (isVariantColorFilter(filter)) return <VariantColorItem filter={filter} />
  if (isVariantTagFilter(filter)) return <VariantTagItem filter={filter} />
  throw new Error(
    `<VariantItem> expected a variant filter value but got: ${JSON.stringify(
      filter.value,
    )}.`,
  )
}

function VariantColorItem({ filter }: { filter: VariantColorFilter }) {
  const { removeFilter } = useContext(FiltersContext)
  const { condition } = filterToStrings(filter)
  return (
    <GenericItem
      name='colors'
      condition={condition}
      value={filter.value.AND.map((c) => c.colors.some.name).join(' / ')}
      onClick={() => removeFilter(filter)}
    />
  )
}

function VariantTagItem({ filter }: { filter: VariantTagFilter }) {
  const { removeFilter } = useContext(FiltersContext)
  const { condition } = filterToStrings(filter)
  return (
    <GenericItem
      name='tags'
      condition={condition}
      value={filter.value.tags.some.name}
      onClick={() => removeFilter(filter)}
    />
  )
}

type ItemButtonProps = {
  className?: string
  children: ReactNode
  onClick?: (event: FormEvent<HTMLButtonElement>) => void
}

function ItemButton({ className, children, onClick }: ItemButtonProps) {
  return (
    <button
      type='button'
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        'flex place-content-center items-center gap-1.5 overflow-hidden px-1.5 transition-colors hover:bg-gray-100 disabled:cursor-default dark:bg-gray-700 dark:hover:bg-gray-600',
        className,
      )}
    >
      <span className='mt-px overflow-hidden text-ellipsis whitespace-nowrap text-2xs'>
        {children}
      </span>
    </button>
  )
}

//////////////////////////////////////////////////////////////////

type AddFilterButtonProps = {
  model: Prisma.DMMF.Model
  hiddenFields?: FilterName[]
}

function AddFilterButton({ model, hiddenFields }: AddFilterButtonProps) {
  // TODO refactor field to instead be an array of pages to support filtering by
  // deeply nested properties (e.g. product -> brand -> country -> name)
  const [open, setOpen] = useState(false)
  const [field, setField] = useState<Prisma.DMMF.Field>()
  const [search, setSearch] = useState('')

  // Reset the selected field when the user closes the filters menu.
  useEffect(() => setField(undefined), [open])
  useEffect(() => setSearch(''), [open, field])

  const fields = model.fields.filter(
    (f) => !hiddenFields?.includes(f.name as FilterName),
  )

  // TODO filter for fetchers that are getting the `MODEL_TO_ROUTE` fields.
  // @see {@link https://github.com/remix-run/remix/discussions/7196}
  const loading = useFetchers().some((f) => f.state === 'loading')

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip tip='Filter' hotkey='f' onHotkey={() => setOpen(true)}>
        <Popover.Trigger asChild>
          <button
            type='button'
            aria-label='Add filter'
            className='icon-button square mb-1.5 flex'
          >
            <Plus className='h-3.5 w-3.5' />
          </button>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Portal>
        <Popover.Content
          align='start'
          className='z-50'
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <MenuContext.Provider value={setOpen}>
            {field?.kind === 'scalar' && <ScalarDialog field={field} />}
            {field?.kind !== 'scalar' && (
              <Menu.Root>
                <Menu.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder={field?.name ?? 'field'}
                  hotkey='f'
                />
                {loading && <LoadingLine className='-mt-px' />}
                <Menu.List>
                  {loading && (
                    <Command.Empty>
                      <div className='animate-pulse h-8 bg-gray-400/10 dark:bg-gray-500/10 m-1 rounded-md' />
                    </Command.Empty>
                  )}
                  {field === undefined &&
                    fields.map((f: Prisma.DMMF.Field) => (
                      <Menu.Item
                        key={f.name}
                        value={f.name}
                        onSelect={() => setField(f)}
                      >
                        {f.name}
                      </Menu.Item>
                    ))}
                  {fields
                    .filter((f) => field === undefined || f.name === field.name)
                    .map((f) => (
                      <Fragment key={f.name}>
                        {f.kind === 'enum' && (
                          <EnumItems nested={!field} field={f} />
                        )}
                        {f.kind === 'object' &&
                          f.name !== 'sizes' &&
                          f.name !== 'variants' &&
                          f.name !== 'season' && (
                            <ObjectItems nested={!field} field={f} />
                          )}
                        {f.name === 'variants' && (
                          <VariantItems nested={!field} />
                        )}
                        {f.name === 'season' && <SeasonItems nested={!field} />}
                      </Fragment>
                    ))}
                </Menu.List>
              </Menu.Root>
            )}
          </MenuContext.Provider>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

//////////////////////////////////////////////////////////////////

type Props = { field: Prisma.DMMF.Field; nested?: boolean }

// if the field is an enum, we collection a dropdown of all the possible enum values
// Ex: <LevelOption />, <TierOption />, <SeasonOption />
function EnumItems({ field, nested }: Props) {
  const { addOrUpdateFilter } = useContext(FiltersContext)

  const data = useData<typeof root>('root')
  const en = data?.enums.find((e) => e.name === field.type)
  invariant(en, `Could not find enum "${field.type}"`)

  const setOpen = useContext(MenuContext)
  const search = useCommandState((state) => state.search)
  if (search.length < 2 && nested) return null
  return (
    <>
      {en.values.map((e) => (
        <Menu.Item
          key={e.name}
          value={`${field.name}-${e.name}`}
          onSelect={() => {
            if (nested)
              addOrUpdateFilter({
                id: nanoid(5),
                name: field.name as FilterName,
                condition: 'equals',
                value: e.name,
              })
            setOpen(false)
          }}
        >
          <Menu.ItemLabel group={nested ? field.name : undefined}>
            {e.name}
          </Menu.ItemLabel>
        </Menu.Item>
      ))}
    </>
  )
}

function useSearchFetcher<T>(route: string) {
  const search = useCommandState((state) => state.search)
  const endpoint = `${route}?search=${encodeURIComponent(search)}`
  const fetcher = useLoadFetcher<T>(endpoint)
  return fetcher
}

// TODO allow users to select multiple objects and then toggle between "AND" and
// "OR" using the filter item (e.g. the "is any of" v.s. "is not" in Linear).
// if the field is an object (i.e. a nested model), we query that model's table
// to collection a list of all the available options (e.g. we'll query the sizes table
// to collection a list of all the possible sizes)
// Ex: <SizeOption />, <BrandOption />, <CountryOption />, <CollectionOption />
function ObjectItems({ field, nested }: Props) {
  const route = MODEL_TO_ROUTE[field.type]
  if (route === undefined)
    throw new Error(`No route defined to load data for field "${field.type}"`)
  const fetcher = useSearchFetcher<{ id: number; name: string }[]>(route)
  const setOpen = useContext(MenuContext)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  if (useCommandState((state) => state.search).length < 2 && nested) return null
  const items = fetcher.data?.map((item) => (
    <Menu.Item
      key={item.id}
      value={`${field.name}-${item.name}`}
      onSelect={() => {
        addOrUpdateFilter({
          id: nanoid(5),
          name: field.name as FilterName,
          condition: field.isList ? 'some' : 'is',
          value: { id: item.id, name: item.name },
        })
        setOpen(false)
      }}
    >
      <Menu.ItemLabel group={nested ? field.name : undefined}>
        {item.name}
      </Menu.ItemLabel>
    </Menu.Item>
  ))
  return <>{items}</>
}

function SeasonItems({ nested }: Pick<Props, 'nested'>) {
  const fetcher = useSearchFetcher<typeof seasons>(MODEL_TO_ROUTE.Season)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setOpen = useContext(MenuContext)
  if (useCommandState((state) => state.search).length < 2 && nested) return null
  const items = fetcher.data?.map((season) => (
    <Menu.Item
      key={season.id}
      value={`season-${season.name}-${season.year}`}
      onSelect={() => {
        const filter: Filter<'season', 'is'> = {
          id: nanoid(5),
          name: 'season',
          condition: 'is',
          value: { id: season.id, name: season.name, year: season.year },
        }
        addOrUpdateFilter(filter)
        setOpen(false)
      }}
    >
      <Menu.ItemLabel group={nested ? 'season' : undefined}>
        {season.name} {season.year}
      </Menu.ItemLabel>
    </Menu.Item>
  ))
  return <>{items}</>
}

enum VariantAttribute {
  COLORS = 'colors',
  TAGS = 'tags',
}

function VariantItems({ nested }: Pick<Props, 'nested'>) {
  const [attribute, setAttribute] = useState<VariantAttribute>()
  if (nested)
    return (
      <>
        <VariantColorItems nested={nested} />
        <VariantTagItems nested={nested} />
      </>
    )
  return attribute === VariantAttribute.COLORS ? (
    <VariantColorItems nested={nested} />
  ) : attribute === VariantAttribute.TAGS ? (
    <VariantTagItems nested={nested} />
  ) : (
    <>
      <Menu.Item
        value={VariantAttribute.COLORS}
        onSelect={() => setAttribute(VariantAttribute.COLORS)}
      >
        <Menu.ItemLabel group='variants'>
          {VariantAttribute.COLORS}
        </Menu.ItemLabel>
      </Menu.Item>
      <Menu.Item
        value={VariantAttribute.TAGS}
        onSelect={() => setAttribute(VariantAttribute.TAGS)}
      >
        <Menu.ItemLabel group='variants'>
          {VariantAttribute.TAGS}
        </Menu.ItemLabel>
      </Menu.Item>
    </>
  )
}

function VariantColorItems({ nested }: Pick<Props, 'nested'>) {
  const fetcher = useSearchFetcher<typeof colors>(MODEL_TO_ROUTE.Color)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setOpen = useContext(MenuContext)
  if (useCommandState((state) => state.search).length < 2 && nested) return null
  const items = uniq(fetcher.data ?? [], getColorName).map((variant) => (
    <Menu.Item
      key={variant.id}
      value={`color-${getColorName(variant)}`}
      onSelect={() => {
        addOrUpdateFilter(getColorFilter(variant))
        setOpen(false)
      }}
    >
      <Menu.ItemLabel group={nested ? 'colors' : undefined}>
        {getColorName(variant)}
      </Menu.ItemLabel>
    </Menu.Item>
  ))
  return <>{items}</>
}

function VariantTagItems({ nested }: Pick<Props, 'nested'>) {
  const fetcher = useSearchFetcher<typeof tags>(MODEL_TO_ROUTE.Tag)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setOpen = useContext(MenuContext)
  if (useCommandState((state) => state.search).length < 2 && nested) return null
  const items = uniq(fetcher.data ?? [], getTagName).map((tag) => (
    <Menu.Item
      key={tag.id}
      value={`tag-${getTagName(tag)}`}
      onSelect={() => {
        addOrUpdateFilter(getTagFilter(tag))
        setOpen(false)
      }}
    >
      <Menu.ItemLabel group={nested ? 'tags' : undefined}>
        {getTagName(tag)}
      </Menu.ItemLabel>
    </Menu.Item>
  ))
  return <>{items}</>
}

// if the field is scalar, we collection an input letting the user type in what value
// they want (e.g. "price is greater than ___")
// Ex: <IntInput />, <DecimalInput />, <StringInput />
//
// if the field is scalar but the dropdown option was specified, we query the
// database to get all the available options (e.g. we'll query the products
// table to get a list of all the possible prices and collection those as options)
// Ex: <IntOption />, <StringOption />, <DecimalOption />
function ScalarDialog({ field, nested }: Props) {
  const [open, setOpen] = useState(true)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setMenuOpen = useContext(MenuContext)

  useEffect(() => {
    if (!open) setMenuOpen(false)
  }, [open, setMenuOpen])

  let inputType: HTMLInputTypeAttribute = 'text'
  if (['BigInt', 'Decimal', 'Float', 'Int'].includes(field.type)) {
    inputType = 'number'
  } else if (field.type === 'DateTime') {
    inputType = 'date'
  } else if (field.type === 'Boolean') {
    inputType = 'checkbox'
  }

  const id = useId()

  if (nested) return null
  return (
    <Dialog open={open} onOpenChange={setOpen} className='w-full max-w-sm'>
      <form
        className='m-8'
        autoComplete='off'
        onSubmit={(event) => {
          let value: FilterValue = new FormData(event.currentTarget).get(id)
          switch (inputType) {
            case 'number':
              value = Number(value)
              break
            case 'date':
              value = new Date(value as string)
              break
            case 'checkbox':
              throw new Error('There are no boolean fields to filter on.')
            default:
          }
          addOrUpdateFilter({
            id: nanoid(5),
            // TODO add a runtime check that this is a valid FilterName
            name: field.name as FilterName,
            condition: field.type === 'String' ? 'contains' : 'equals',
            value,
          })
          setOpen(false)
          event.preventDefault()
        }}
      >
        <Dialog.Title className='mb-6 mt-10 text-center text-2xl'>
          filter by {field.name}
        </Dialog.Title>
        <input
          className='input'
          aria-label='value'
          type={inputType}
          name={id}
          id={id}
          required
        />
        <div className='mt-4 flex items-center justify-end'>
          <Dialog.Close asChild>
            <button type='button' className='button outlined mr-3'>
              cancel
            </button>
          </Dialog.Close>
          <button className='button' type='submit'>
            apply
          </button>
        </div>
      </form>
    </Dialog>
  )
}
