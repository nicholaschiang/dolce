import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from 'utils/cn'

const emptyVariants = cva(
  'flex flex-col items-center justify-center text-center rounded-md border border-dashed py-6 px-4 text-sm overflow-hidden break-all',
  {
    variants: {
      variant: {
        default: 'border-gray-300 dark:border-gray-600 text-gray-500',
        error: 'border-red-700 text-red-800',
        warning: 'border-amber-600 text-amber-700',
      },
      size: {
        default: 'h-full',
        sm: 'h-60',
        md: 'h-80',
        lg: 'h-96',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  asChild?: boolean
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
        className={cn(emptyVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Empty.displayName = 'Empty'

export { Empty, emptyVariants }
