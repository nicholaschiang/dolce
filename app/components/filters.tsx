import type { Level, Prisma } from '@prisma/client'
import { CaretDownIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { useFetcher } from '@remix-run/react'
import cn from 'classnames'
import { useCommandState } from 'cmdk'
import { dequal } from 'dequal/lite'
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
  useRef,
  useState,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import invariant from 'tiny-invariant'

import type { loader as layout } from 'routes/__layout'
import type { loader as sizes } from 'routes/__layout/sizes'
import type { loader as variants } from 'routes/__layout/variants'

import { Dialog } from 'components/dialog'
import * as Menu from 'components/menu'
import { Tooltip } from 'components/tooltip'

import type { Filter, FilterName, FilterValue } from 'filters'
import { filterToStrings } from 'filters'
import { clone, useData } from 'utils'

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
  Color: '/colors',
  Variant: '/variants',
  Price: '/prices',
  Collection: '/collections',
  Season: '/seasons',
  Show: '/shows',
  Designer: '/designers',
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
  hiddenFields?: string[]
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
  const data = useData<typeof layout>('routes/__layout')
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
      <nav className='frosted flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-700'>
        <ul className='-mb-1.5 flex flex-wrap'>
          {filters.map((f) => (
            <>
              {f.name !== 'variants' && <Item key={f.id} filter={f} />}
              {f.name === 'variants' && <VariantItem key={f.id} filter={f} />}
            </>
          ))}
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
        <Cross2Icon />
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

function isColorsArray(array: unknown[]): array is { name: string }[] {
  return array.every(
    (object) =>
      typeof object === 'object' &&
      object !== null &&
      'name' in object &&
      typeof object.name === 'string',
  )
}

function VariantItem({ filter }: ItemProps) {
  const { removeFilter } = useContext(FiltersContext)
  const { name, condition } = filterToStrings(filter)
  if (
    typeof filter.value === 'object' &&
    filter.value !== null &&
    'colors' in filter.value &&
    typeof filter.value.colors === 'object' &&
    filter.value.colors !== null &&
    'some' in filter.value.colors &&
    typeof filter.value.colors.some === 'object' &&
    filter.value.colors.some !== null &&
    'AND' in filter.value.colors.some &&
    filter.value.colors.some.AND instanceof Array &&
    isColorsArray(filter.value.colors.some.AND)
  )
    return (
      <GenericItem
        name={name}
        condition={condition}
        value={filter.value.colors.some.AND.map((c) => c.name).join(' ')}
        onClick={() => removeFilter(filter)}
      />
    )
  throw new Error(
    `<VariantItem> expected a variant filter value but got: ${JSON.stringify(
      filter.value,
    )}.`,
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
  hiddenFields?: string[]
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

  const fields = model.fields.filter((f) => !hiddenFields?.includes(f.name))

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Tooltip tip='Filter' hotkey='f' onHotkey={() => setOpen(true)}>
        <Popover.Trigger asChild>
          <button type='button' className='icon-button square mb-1.5 flex'>
            <PlusIcon className='h-3.5 w-3.5' />
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
                <Menu.List>
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
                          f.name !== 'variants' && (
                            <ObjectItems nested={!field} field={f} />
                          )}
                        {f.name === 'sizes' && <SizeItems nested={!field} />}
                        {f.name === 'variants' && (
                          <VariantItems nested={!field} />
                        )}
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

// if the field is an enum, we show a dropdown of all the possible enum values
// Ex: <LevelOption />, <TierOption />, <SeasonOption />
function EnumItems({ field, nested }: Props) {
  const { filters, addOrUpdateFilter } = useContext(FiltersContext)

  // TODO while this should work for any enum, we shouldn't hardcode to only the
  // Level enum type and should instead see if a union would work here as well.
  // if not, i may have to split this up into individual components; i may want
  // to do that eventually anyways (e.g. to render special icons per option).
  const filterId = useRef(nanoid(5))
  const filter = filters.find((f) => f.id === filterId.current) as
    | Filter<'level', 'in', Level[]>
    | undefined

  const data = useData<typeof layout>('routes/__layout')
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
                id: filterId.current,
                name: 'level',
                condition: 'equals',
                value: e.name,
              })
            setOpen(false)
          }}
          checked={
            nested ? undefined : filter?.value?.includes(e.name as Level)
          }
          setChecked={
            nested
              ? undefined
              : (checked: boolean | 'indeterminate') => {
                  const updated = clone(filter) ?? {
                    id: filterId.current,
                    name: 'level',
                    condition: 'in',
                    value: [],
                  }
                  if (checked) {
                    updated.value = [...(filter?.value ?? []), e.name as Level]
                    addOrUpdateFilter(updated)
                  } else {
                    const idx = updated.value.indexOf(e.name as Level)
                    if (idx >= 0) {
                      updated.value = [
                        ...updated.value.slice(0, idx),
                        ...updated.value.slice(idx + 1),
                      ]
                      addOrUpdateFilter(updated)
                    }
                  }
                }
          }
        >
          <Menu.ItemLabel group={nested ? field.name : undefined}>
            {e.name}
          </Menu.ItemLabel>
        </Menu.Item>
      ))}
    </>
  )
}

// TODO allow users to select multiple objects and then toggle between "AND" and
// "OR" using the filter item (e.g. the "is any of" v.s. "is not" in Linear).
// if the field is an object (i.e. a nested model), we query that model's table
// to show a list of all the available options (e.g. we'll query the sizes table
// to show a list of all the possible sizes)
// Ex: <SizeOption />, <BrandOption />, <CountryOption />, <ShowOption />
function ObjectItems({ field, nested }: Props) {
  // TODO we need to ensure that each one of our Prisma models has a name field
  // TODO perhaps we should define individual components for each model? that
  // would let us do fancy things with the menu item UI (e.g. colors should
  // show a little dot of their color in the menu options)
  const fetcher = useFetcher<{ id: number; name: string }[]>()
  useEffect(() => {
    const route = MODEL_TO_ROUTE[field.type]
    if (route === undefined)
      throw new Error(`No route defined to load data for field "${field.type}"`)
    if (fetcher.type === 'init') fetcher.load(route)
  }, [fetcher, field.type])

  // TODO show a skeleton state while the options are loading
  const setOpen = useContext(MenuContext)
  const { addOrUpdateFilter } = useContext(FiltersContext)

  const search = useCommandState((state) => state.search)
  if (search.length < 2 && nested) return null
  return (
    <>
      {(fetcher.data ?? []).map((item) => (
        <Menu.Item
          key={item.id}
          value={`${field.name}-${item.name}`}
          onSelect={() => {
            addOrUpdateFilter({
              id: nanoid(5),
              // TODO add a runtime check that this is a valid FilterName
              name: field.name as FilterName,
              condition: 'some',
              value: { id: item.id, name: item.name },
            })
            setOpen(false)
          }}
        >
          <Menu.ItemLabel group={nested ? field.name : undefined}>
            {item.name}
          </Menu.ItemLabel>
        </Menu.Item>
      ))}
    </>
  )
}

function VariantItems({ nested }: Pick<Props, 'nested'>) {
  const fetcher = useFetcher<typeof variants>()
  useEffect(() => {
    if (fetcher.type === 'init') fetcher.load(MODEL_TO_ROUTE.Variant)
  }, [fetcher])
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setOpen = useContext(MenuContext)
  const search = useCommandState((state) => state.search)
  if (search.length < 2 && nested) return null
  return (
    <>
      {(fetcher.data ?? [])
        .filter(
          (variant, index, self) =>
            index === self.findIndex((v) => dequal(v.colors, variant.colors)),
        )
        .map((variant) => (
          <Menu.Item
            key={variant.id}
            value={`variant-${variant.name}`}
            onSelect={() => {
              addOrUpdateFilter({
                id: nanoid(5),
                name: 'variants',
                condition: 'some',
                value: {
                  colors: {
                    some: {
                      AND: variant.colors.map((color) => ({
                        id: color.id,
                        name: color.name,
                      })),
                    },
                  },
                },
              })
              setOpen(false)
            }}
          >
            <Menu.ItemLabel group={nested ? 'variants' : undefined}>
              {variant.colors.map((color) => color.name).join(' ')}
            </Menu.ItemLabel>
          </Menu.Item>
        ))}
    </>
  )
}

function SizeItems({ nested }: Pick<Props, 'nested'>) {
  const fetcher = useFetcher<typeof sizes>()
  useEffect(() => {
    if (fetcher.type === 'init') fetcher.load(MODEL_TO_ROUTE.Size)
  }, [fetcher])
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const setOpen = useContext(MenuContext)
  const search = useCommandState((state) => state.search)
  if (search.length < 2 && nested) return null
  return (
    <>
      {(fetcher.data ?? []).map((size) => (
        <Menu.Item
          key={size.id}
          value={`size-${size.name}`}
          onSelect={() => {
            addOrUpdateFilter({
              id: nanoid(5),
              name: 'sizes',
              condition: 'some',
              value: { id: size.id, name: size.name },
            })
            setOpen(false)
          }}
        >
          <Menu.ItemLabel group={nested ? 'sizes' : undefined}>
            <span className='flex items-center truncate text-gray-500'>
              {size.sex}
              <CaretDownIcon className='mx-2 h-3 w-3 -rotate-90' />
            </span>
            {size.name}
          </Menu.ItemLabel>
        </Menu.Item>
      ))}
    </>
  )
}

// if the field is scalar, we show an input letting the user type in what value
// they want (e.g. "price is greater than ___")
// Ex: <IntInput />, <DecimalInput />, <StringInput />
//
// if the field is scalar but the dropdown option was specified, we query the
// database to get all the available options (e.g. we'll query the products
// table to get a list of all the possible prices and show those as options)
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
              value = value === 'true'
              break
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
