import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import cn from 'classnames'
import { useHotkeys } from 'react-hotkeys-hook'

import { Hotkey } from 'components/hotkey'

export type TooltipProps = {
  children: ReactNode
  tip: string
  hotkey?: string
  onHotkey?: () => void
}

export function Tooltip({ children, tip, hotkey, onHotkey }: TooltipProps) {
  useHotkeys(
    hotkey ?? '',
    (event) => {
      if (onHotkey) {
        event.preventDefault()
        event.stopPropagation()
        onHotkey()
      }
    },
    [hotkey, onHotkey],
  )
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            collisionPadding={10}
            side='bottom'
            sideOffset={4}
            className={cn(
              'radix-side-top:animate-slide-down-fade',
              'radix-side-right:animate-slide-left-fade',
              'radix-side-bottom:animate-slide-up-fade',
              'radix-side-left:animate-slide-right-fade',
              'inline-flex items-center rounded px-2 py-1.25',
              'border border-gray-200 dark:border-gray-700',
              'frosted z-50 gap-2 lowercase shadow-sm',
            )}
          >
            <span className='block text-3xs leading-none text-gray-700 dark:text-gray-300'>
              {tip}
            </span>
            {hotkey && <Hotkey>{hotkey}</Hotkey>}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
