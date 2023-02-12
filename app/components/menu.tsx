import * as Checkbox from '@radix-ui/react-checkbox'
import * as Portal from '@radix-ui/react-portal'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import cn from 'classnames'
import { motion } from 'framer-motion'

type MenuItemProps = {
  label: string
  checked?: boolean | 'indeterminate'
  setChecked?(checked: boolean | 'indeterminate'): void
  onClick?(): void
}

function MenuItem({ label, checked, setChecked, onClick }: MenuItemProps) {
  return (
    <li className='relative flex h-8 w-full min-w-min max-w-xl items-center text-ellipsis whitespace-nowrap hover:after:absolute hover:after:inset-y-0 hover:after:inset-x-1 hover:after:-z-10 hover:after:rounded-md hover:after:bg-gray-400/10 hover:after:dark:bg-gray-500/10'>
      <div
        tabIndex={-1}
        role='menuitem'
        onClick={() => {
          if (setChecked) setChecked(!checked)
          if (onClick) onClick()
        }}
        onKeyDown={() => {
          if (setChecked) setChecked(!checked)
          if (onClick) onClick()
        }}
        className='flex h-full flex-1 items-center overflow-hidden px-3.5'
      >
        {setChecked && (
          <Checkbox.Root
            checked={checked}
            onCheckedChange={setChecked}
            className={cn(
              'mr-3 flex h-3.5 w-3.5 appearance-none items-center justify-center rounded-sm border p-0.5 outline-none transition-colors',
              !checked &&
                'border-gray-500/50 bg-transparent dark:border-gray-400/50',
              checked && 'border-indigo-500 bg-indigo-500 text-white',
            )}
          >
            <Checkbox.Indicator
              forceMount
              className={cn(
                'transition-opacity',
                checked ? 'opacity-100' : 'opacity-0',
              )}
            >
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
        )}
        {label}
      </div>
    </li>
  )
}

export type MenuProps = {
  position: { top: number; left: number }
  setOpen: Dispatch<SetStateAction<boolean>>
  items: MenuItemProps[]
}

export function Menu({ position, setOpen, items }: MenuProps) {
  const [filter, setFilter] = useState('')
  const results = useMemo(
    () => items.filter(({ label }) => label.includes(filter.trim())),
    [items, filter],
  )
  return (
    <Portal.Root>
      <div
        tabIndex={-1}
        role='button'
        aria-label='Close Menu'
        onClick={() => setOpen(false)}
        onKeyDown={() => setOpen(false)}
        className='fixed inset-0 z-40 flex cursor-default items-start justify-center'
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.1 }}
        className='frosted fixed z-50 mt-0.5 flex min-w-min max-w-xl origin-top-left flex-col overflow-hidden rounded-lg border border-gray-200 text-xs shadow-xl will-change-transform dark:border-gray-700'
        style={position}
        layoutDependency={results}
        layout
      >
        <div
          className={cn(
            'flex items-center border-gray-200 dark:border-gray-700',
            results.length && 'border-b',
          )}
        >
          <input
            className='flex-1 appearance-none bg-transparent px-3.5 pt-2.5 pb-2 caret-indigo-500 outline-none'
            type='text'
            placeholder='filter…'
            spellCheck='false'
            autoComplete='off'
            value={filter}
            onChange={(evt) => setFilter(evt.currentTarget.value)}
          />
        </div>
        <ul role='menu' className={cn(results.length && 'py-1')}>
          {results.map((result) => (
            <MenuItem {...result} key={result.label} />
          ))}
        </ul>
      </motion.div>
    </Portal.Root>
  )
}
