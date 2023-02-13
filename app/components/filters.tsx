import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import type {
  Dispatch,
  FormEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
} from 'react'
import type { Level, Prisma } from '@prisma/client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import invariant from 'tiny-invariant'
import { nanoid } from 'nanoid'
import { useFetcher } from '@remix-run/react'

import type { LoaderData as LayoutLoaderData } from 'routes/__layout'

import { Menu } from 'components/menu'
import type { MenuProps } from 'components/menu'

import { clone, useMatchesData } from 'utils'
import type { Filter } from 'filters'
import { filterToStrings } from 'filters'

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
const MenuContext = createContext<Pick<MenuProps, 'position' | 'setOpen'>>({
  position: { top: 0, left: 0 },
  setOpen() {},
})

//////////////////////////////////////////////////////////////////

export type FiltersProps = {
  modelName: string
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}

// TODO how do we handle multiple filter items with the same filter name?
export function Filters({ modelName, filters, setFilters }: FiltersProps) {
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

  const data = useMatchesData<LayoutLoaderData>('routes/__layout')
  invariant(data, 'Could not load schema data')
  const model = data.models.find((m) => m.name === modelName)
  invariant(model, `Could not find model "${modelName}"`)

  return (
    <FiltersContext.Provider
      value={useMemo(
        () => ({ filters, addOrUpdateFilter, removeFilter }),
        [filters, addOrUpdateFilter, removeFilter],
      )}
    >
      <nav className='frosted border-b border-gray-200 px-12 py-3 dark:border-gray-700'>
        <ul className='-mb-1.5 flex flex-wrap'>
          {filters.map((f) => (
            <FilterItem key={f.id} filter={f} />
          ))}
          <AddFilterButton model={model} />
        </ul>
      </nav>
    </FiltersContext.Provider>
  )
}

//////////////////////////////////////////////////////////////////

type FilterItemButtonProps = {
  className?: string
  children: ReactNode
  onClick?: (event: FormEvent<HTMLButtonElement>) => void
}

function FilterItemButton({
  className,
  children,
  onClick,
}: FilterItemButtonProps) {
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

type FilterItemProps = { filter: Filter }

function FilterItem({ filter }: FilterItemProps) {
  const { removeFilter } = useContext(FiltersContext)
  const { name, condition, value } = filterToStrings(filter)
  return (
    <li className='mr-1.5 mb-1.5 flex h-6 flex-none items-stretch gap-px overflow-hidden rounded border border-gray-200 bg-white last:mr-0 dark:border-none dark:bg-transparent'>
      <FilterItemButton>{name}</FilterItemButton>
      <FilterItemButton className='text-gray-400'>{condition}</FilterItemButton>
      <FilterItemButton>{value}</FilterItemButton>
      <FilterItemButton
        className='text-gray-400 hover:text-inherit'
        onClick={() => removeFilter(filter)}
      >
        <Cross2Icon />
      </FilterItemButton>
    </li>
  )
}

//////////////////////////////////////////////////////////////////

type AddFilterButtonProps = { model: Prisma.DMMF.Model }

function AddFilterButton({ model }: AddFilterButtonProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const [field, setField] = useState<Prisma.DMMF.Field>()

  // Reset the selected field when the user closes the filters menu
  useEffect(() => {
    if (!open) setField(undefined)
  }, [open])

  // TODO refactor this to only have a single <Menu> component and get rid of
  // the MenuContext; instead we should just have helper functions return the
  // items that should be rendered in that one <Menu> component.
  return (
    <>
      <button
        type='button'
        className='icon-button mb-1.5 flex rounded'
        onClick={(event) => {
          const { top, left, height } =
            event.currentTarget.getBoundingClientRect()
          setPosition({ top: top + height, left })
          setOpen(true)
        }}
      >
        <PlusIcon className='h-3.5 w-3.5' />
      </button>
      <MenuContext.Provider
        value={useMemo(() => ({ setOpen, position }), [setOpen, position])}
      >
        {open && !field && (
          <FilterNameMenu fields={model.fields} setField={setField} />
        )}
        {open && field && <FilterValueMenu field={field} />}
      </MenuContext.Provider>
    </>
  )
}

//////////////////////////////////////////////////////////////////

type FilterNameMenuProps = {
  fields: Prisma.DMMF.Field[]
  setField: Dispatch<SetStateAction<Prisma.DMMF.Field | undefined>>
}

function FilterNameMenu({ fields, setField }: FilterNameMenuProps) {
  const { setOpen, position } = useContext(MenuContext)
  return (
    <Menu
      placeholder='field'
      setOpen={setOpen}
      position={position}
      items={fields.map((f: Prisma.DMMF.Field) => ({
        label: f.name,
        onClick: () => setField(f),
      }))}
    />
  )
}

type FilterValueMenuProps = { field: Prisma.DMMF.Field }

function FilterValueMenu({ field }: FilterValueMenuProps) {
  switch (field.kind) {
    case 'enum':
      return <EnumMenu field={field} />
    case 'scalar':
      return <ScalarMenu field={field} />
    case 'object':
      return <ObjectMenu field={field} />
    case 'unsupported':
      throw new Error(`Unsupported field "${field.type}" on "${field.name}"`)
    default:
      throw new Error(`Unknown field "${field.type}" on "${field.name}"`)
  }
}

//////////////////////////////////////////////////////////////////

// if the field is an enum, we show a dropdown of all the possible enum values
// Ex: <LevelOption />, <TierOption />, <SeasonOption />
function EnumMenu({ field }: FilterValueMenuProps) {
  const { position, setOpen } = useContext(MenuContext)
  const { filters, addOrUpdateFilter } = useContext(FiltersContext)

  // TODO while this should work for any enum, we shouldn't hardcode to only the
  // Level enum type and should instead see if a union would work here as well.
  // if not, i may have to split this up into individual components; i may want
  // to do that eventually anyways (e.g. to render special icons per option).
  const filterId = useRef(nanoid(5))
  const filter = filters.find((f) => f.id === filterId.current) as
    | Filter<'level', 'in', Level[]>
    | undefined

  const data = useMatchesData<LayoutLoaderData>('routes/__layout')
  invariant(data, 'Could not load schema data')
  const en = data.enums.find((e) => e.name === field.type)
  invariant(en, `Could not find enum "${field.type}"`)

  return (
    <Menu
      placeholder={field.name}
      items={en.values.map((e) => ({
        label: e.name,
        checked: filter?.value?.includes(e.name as Level),
        setChecked(checked: boolean | 'indeterminate') {
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
        },
      }))}
      position={position}
      setOpen={setOpen}
    />
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
function ScalarMenu({ field }: FilterValueMenuProps) {
  const [open, setOpen] = useState(true)
  const { addOrUpdateFilter } = useContext(FiltersContext)
  const { setOpen: setMenuOpen } = useContext(MenuContext)

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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-white/50 dark:bg-gray-900/50' />
        <Dialog.Content className='center fixed w-full max-w-sm rounded-xl border border-gray-200 bg-gray-100 shadow-2xl focus:outline-none dark:border-gray-700 dark:bg-gray-800'>
          <form
            className='m-8'
            autoComplete='off'
            onSubmit={(event) => {
              addOrUpdateFilter({
                id: nanoid(5),
                name: field.name,
                condition: field.type === 'String' ? 'contains' : 'equals',
                value: new FormData(event.currentTarget).get('value'),
              })
              setOpen(false)
              event.preventDefault()
            }}
          >
            <Dialog.Title>filter by {field.name}</Dialog.Title>
            <input
              autoFocus
              className='input mt-3'
              aria-label='value'
              type={inputType}
              name='value'
              id='value'
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// TODO allow users to select multiple objects and then toggle between "AND" and
// "OR" using the filter item (e.g. the "is any of" v.s. "is not" in Linear).
// if the field is an object (i.e. a nested model), we query that model's table
// to show a list of all the available options (e.g. we'll query the sizes table
// to show a list of all the possible sizes)
// Ex: <SizeOption />, <BrandOption />, <CountryOption />, <ShowOption />
function ObjectMenu({ field }: FilterValueMenuProps) {
  const { position, setOpen } = useContext(MenuContext)
  const { addOrUpdateFilter } = useContext(FiltersContext)

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

  // TODO make items optional in <Menu> and show a skeleton state there
  return (
    <Menu
      placeholder={field.name}
      items={(fetcher.data ?? []).map((item) => ({
        label: item.name,
        onClick() {
          addOrUpdateFilter({
            id: nanoid(5),
            name: field.name,
            condition: 'some',
            value: { id: item.id, name: item.name },
          })
          setOpen(false)
        },
      }))}
      position={position}
      setOpen={setOpen}
    />
  )
}
