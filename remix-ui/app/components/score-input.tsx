import * as RadioGroup from '@radix-ui/react-radio-group'
import { StarHalf } from 'lucide-react'
import * as React from 'react'

import { cn } from 'utils/cn'

const ScoreInput = React.forwardRef<
  React.ElementRef<typeof RadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Root>
>(({ className, ...props }, ref) => (
  <RadioGroup.Root
    className={cn(
      'flex items-center flex-row-reverse group justify-end relative w-min',
      className,
    )}
    {...props}
    orientation='horizontal'
    ref={ref}
  >
    {[5, 4, 3, 2, 1].map((value) => (
      <Star value={value} key={value} />
    ))}
  </RadioGroup.Root>
))
ScoreInput.displayName = RadioGroup.Root.displayName

function Star({ value }: { value: number }) {
  return (
    <>
      <StarSide right value={value.toString()} />
      <StarSide left value={(value - 0.5).toString()} />
    </>
  )
}

function StarSide({
  left,
  right,
  value,
}: {
  left?: boolean
  right?: boolean
  value: string
}) {
  return (
    <RadioGroup.Item
      className={cn(
        'overflow-hidden peer text-gray-300 dark:text-gray-600 transition-colors',
        'group-hover:aria-checked:text-gray-300 dark:group-hover:aria-checked:text-gray-600 group-hover:peer-aria-checked:text-gray-300 dark:group-hover:peer-aria-checked:text-gray-600',
        'aria-checked:text-gray-900 dark:aria-checked:text-gray-100 peer-aria-checked:text-gray-900 dark:peer-aria-checked:text-gray-100',
        'hover:!text-gray-900 dark:hover:!text-gray-100 peer-hover:!text-gray-900 dark:peer-hover:!text-gray-100',
        right && 'pr-0.5 first-of-type:pr-0',
        left && 'pl-0.5 last-of-type:pl-0',
      )}
      value={value}
    >
      <RadioGroup.Indicator />
      <StarHalf
        className={cn(
          'w-6 h-6',
          right && '-ml-3 -scale-x-100',
          left && '-mr-3',
        )}
      />
    </RadioGroup.Item>
  )
}

export { ScoreInput }
