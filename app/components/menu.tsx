import * as Checkbox from '@radix-ui/react-checkbox'
import cn from 'classnames'
import { Command, useCommandState } from 'cmdk'
import { ChevronDown, Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { Hotkey } from 'components/hotkey'

export type RootProps = {
  children?: ReactNode[]
}

export function Root({ children }: RootProps) {
  return (
    <Command className='frosted fixed mt-0.5 flex min-w-min max-w-xl origin-top-left flex-col overflow-hidden rounded-lg border border-gray-200 text-xs shadow-xl will-change-transform dark:border-gray-700'>
      {children}
    </Command>
  )
}

export type InputProps = {
  hotkey?: string
  placeholder?: string
  value?: string
  onValueChange?: (search: string) => void
}

export function Input({
  hotkey,
  placeholder,
  value,
  onValueChange,
}: InputProps) {
  const count = useCommandState((state) => state.filtered.count)
  return (
    <div
      className={cn(
        'flex items-center border-gray-200 dark:border-gray-700',
        count > 0 && 'border-b',
      )}
    >
      <Command.Input
        ref={(input) => input?.focus()}
        className='flex-1 appearance-none bg-transparent px-3.5 pt-2.5 pb-2 outline-none placeholder:text-gray-500/50 dark:placeholder:text-gray-400/50'
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
      />
      {hotkey && <Hotkey className='mr-3.5'>{hotkey}</Hotkey>}
    </div>
  )
}

export type ListProps = { children?: ReactNode }

export function List({ children }: ListProps) {
  const count = useCommandState((state) => state.filtered.count)
  return (
    <Command.List className={cn(count > 0 && 'py-1')}>{children}</Command.List>
  )
}

export type ItemProps = {
  value: string
  children: ReactNode
  checked?: boolean | 'indeterminate'
  setChecked?(checked: boolean | 'indeterminate'): void
  onSelect?(): void
}

export function Item({
  value,
  checked,
  setChecked,
  onSelect,
  children,
}: ItemProps) {
  return (
    <Command.Item
      value={value}
      onSelect={() => {
        if (setChecked) setChecked(!checked)
        if (onSelect) onSelect()
      }}
      className='group relative flex h-8 w-full min-w-min max-w-xl cursor-pointer items-center text-ellipsis whitespace-nowrap aria-selected:after:absolute aria-selected:after:inset-y-0 aria-selected:after:inset-x-1 aria-selected:after:-z-10 aria-selected:after:rounded-md aria-selected:after:bg-gray-400/10 aria-selected:after:dark:bg-gray-500/10'
    >
      <div className='flex h-full flex-1 items-center overflow-hidden px-3.5'>
        {setChecked && (
          <Checkbox.Root
            tabIndex={-1}
            checked={checked}
            onCheckedChange={setChecked}
            onClick={(event) => event.stopPropagation()}
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
              <Check className='w-3 h-3' />
            </Checkbox.Indicator>
          </Checkbox.Root>
        )}
        {children}
      </div>
    </Command.Item>
  )
}

export type ItemLabelProps = { group?: string; children: ReactNode }

export function ItemLabel({ group, children }: ItemLabelProps) {
  return (
    <span className='inline-flex flex-1 items-center truncate'>
      {group && <span className='truncate'>{group}</span>}
      {group && (
        <span className='mr-8 flex flex-1 items-center truncate text-gray-500'>
          <ChevronDown className='mx-2 h-3 w-3 -rotate-90 group-aria-selected:text-gray-900 dark:group-aria-selected:text-gray-100' />
          {children}
        </span>
      )}
      {!group && children}
    </span>
  )
}
