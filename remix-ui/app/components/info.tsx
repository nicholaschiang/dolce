import { type PropsWithChildren } from 'react'

import { cn } from 'utils/cn'

export function Info({ children }: PropsWithChildren) {
  return <dl className='mt-2 flex flex-col gap-2'>{children}</dl>
}

export function InfoItem({
  label,
  className,
  children,
}: PropsWithChildren<{ label: string; className?: string }>) {
  return (
    <div className='flex items-center text-xs'>
      <dt className='flex-none shrink-0 w-24 text-gray-500'>{label}</dt>
      <dd
        className={cn(
          'w-0 flex-1 truncate text-gray-700 dark:text-gray-300',
          className,
        )}
      >
        {children}
      </dd>
    </div>
  )
}
