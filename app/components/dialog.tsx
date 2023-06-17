import * as DialogPrimitive from '@radix-ui/react-dialog'
import cn from 'classnames'
import type { ReactNode } from 'react'

export type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOpenAutoFocus?: (event: Event) => void
  children?: ReactNode
  className?: string
}

export function Dialog({
  open,
  onOpenChange,
  onOpenAutoFocus,
  children,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-40 bg-white/50 dark:bg-gray-900/50' />
        <DialogPrimitive.Content
          className={cn(
            'center fixed z-50 overflow-hidden rounded-xl border border-gray-200/50 bg-white shadow-2xl focus:outline-none dark:border-gray-700/50 dark:bg-gray-900',
            className,
          )}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

Dialog.Title = DialogPrimitive.Title
Dialog.Close = DialogPrimitive.Close
