import * as Checkbox from '@radix-ui/react-checkbox'
import * as Portal from '@radix-ui/react-portal'
import { Command, useCommandState } from 'cmdk'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import { Key } from 'ts-key-enum'
import cn from 'classnames'
import { useHotkeys } from 'react-hotkeys-hook'

import { Hotkey } from 'components/hotkey'

const RootContext = createContext<RootProps>({
  position: { top: 0, left: 0 },
  setOpen() {},
})
const useRoot = () => useContext(RootContext)

export type RootProps = {
  position: { top: number; left: number }
  setOpen: Dispatch<SetStateAction<boolean>>
  children?: ReactNode[]
}

export function Root(props: RootProps) {
  const { position, setOpen, children } = props
  useHotkeys<HTMLInputElement>(
    'esc',
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
    },
    [setOpen],
  )
  return (
    <Portal.Root>
      <div
        tabIndex={-1}
        role='button'
        aria-label='Close Menu'
        onClick={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === Key.Enter) {
            setOpen(false)
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        className='fixed inset-0 z-30 flex cursor-default items-start justify-center'
      />
      <Command
        className='frosted fixed z-40 mt-0.5 flex min-w-min max-w-xl origin-top-left flex-col overflow-hidden rounded-lg border border-gray-200 text-xs shadow-xl will-change-transform dark:border-gray-700'
        style={position}
      >
        <RootContext.Provider value={props}>{children}</RootContext.Provider>
      </Command>
    </Portal.Root>
  )
}

export type InputProps = { hotkey?: string; placeholder?: string }

export function Input({ hotkey, placeholder }: InputProps) {
  const { setOpen } = useRoot()
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
        onKeyDownCapture={(event) => {
          if (event.key === Key.Escape) {
            event.preventDefault()
            event.stopPropagation()
            setOpen(false)
          }
        }}
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
  children: ReactNode
  checked?: boolean | 'indeterminate'
  setChecked?(checked: boolean | 'indeterminate'): void
  onSelect?(): void
}

export function Item({ checked, setChecked, onSelect, children }: ItemProps) {
  return (
    <Command.Item
      onSelect={() => {
        if (setChecked) setChecked(!checked)
        if (onSelect) onSelect()
      }}
      className='relative flex h-8 w-full min-w-min max-w-xl cursor-pointer items-center text-ellipsis whitespace-nowrap aria-selected:after:absolute aria-selected:after:inset-y-0 aria-selected:after:inset-x-1 aria-selected:after:-z-10 aria-selected:after:rounded-md aria-selected:after:bg-gray-400/10 aria-selected:after:dark:bg-gray-500/10'
    >
      <div className='flex h-full flex-1 items-center overflow-hidden px-3.5'>
        {setChecked && (
          <Checkbox.Root
            tabIndex={-1}
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
        {children}
      </div>
    </Command.Item>
  )
}
