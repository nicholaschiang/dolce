import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PlusIcon } from '@radix-ui/react-icons'
import type { Prisma } from '@prisma/client'
import cn from 'classnames'
import { dequal } from 'dequal/lite'
import { useState } from 'react'

import { Menu } from 'components/menu'

import type { Filter, FilterCondition, FilterName, FilterValue } from 'filters'
import { filterToSearchParam } from 'filters'

const STYLES = [
  'coat & jackets',
  'coat',
  'sweatshirts',
  'sweatshirt',
  'pants',
  'jeans',
  'tops',
  'shirt & blouse',
  't-shirts',
  't-shirt',
  'knitwear',
  'jumpsuit',
  'jacket',
  'belts',
  'belt',
  'swimwear',
  'bikini bottom',
  'shoes',
  'sneakers',
  'boots',
  'flats',
  'sandals',
  'other accessories',
  'hat',
  'shorts',
  'jewelry',
  'earrings',
  'bracelet',
  'necklace',
  'ring',
]

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
      <span className='mt-px max-w-2xs overflow-hidden text-ellipsis whitespace-nowrap text-2xs'>
        {children}
      </span>
    </button>
  )
}

type FilterItemProps = { filter: Filter }

function FilterItem({ filter }: FilterItemProps) {
  return (
    <li className='mr-1.5 mb-1.5 flex h-6 flex-none items-stretch gap-px overflow-hidden rounded border border-gray-200 bg-white last:mr-0 dark:border-none dark:bg-transparent'>
      <FilterItemButton>{filter.name}</FilterItemButton>
      <FilterItemButton className='text-gray-400'>
        {filter.condition.toString()}
      </FilterItemButton>
      <FilterItemButton>{JSON.stringify(filter.value)}</FilterItemButton>
    </li>
  )
}

type CreateFilterItemProps = {
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}

function CreateFilterItem({ filters, setFilters }: CreateFilterItemProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  return (
    <>
      <button
        type='button'
        className='flex h-6 w-6 items-center justify-center rounded text-2xs text-gray-600 transition-colors hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
        onClick={(evt) => {
          const { top, left, height } =
            evt.currentTarget.getBoundingClientRect()
          setPosition({ top: top + height, left })
          setOpen(true)
        }}
      >
        <PlusIcon className='h-3.5 w-3.5' />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Menu
            setOpen={setOpen}
            position={position}
            items={STYLES.map((style) => {
              const filter: Filter<'styles', 'some'> = {
                name: 'styles',
                condition: 'some',
                value: { name: style },
              }
              return {
                label: style,
                checked: filters.some((f) => dequal(f, filter)),
                setChecked(checked: boolean | 'indeterminate') {
                  if (checked) {
                    setFilters((prev) => [...prev, filter])
                  } else {
                    setFilters((prev) => prev.filter((f) => !dequal(f, filter)))
                  }
                  setOpen(false)
                },
              }
            })}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export type FiltersProps = {
  model: string
  models: Prisma.DMMF.Model[]
  enums: Prisma.DMMF.DatamodelEnum[]
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}

export function Filters({
  model,
  models,
  enums,
  filters,
  setFilters,
}: FiltersProps) {
  return (
    <nav className='frosted sticky top-0 z-30 flex-initial border-b border-gray-200 px-12 py-3 dark:border-gray-700'>
      <ul className='-mb-1.5 flex flex-wrap'>
        {filters.map((filter) => (
          <FilterItem filter={filter} key={filterToSearchParam(filter)} />
        ))}
        <CreateFilterItem filters={filters} setFilters={setFilters} />
      </ul>
    </nav>
  )
}
