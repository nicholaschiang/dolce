import { Link } from '@remix-run/react'
import { Link as LinkIcon } from 'lucide-react'
import { type PropsWithChildren } from 'react'

import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'

export function Section({
  id,
  header,
  children,
}: PropsWithChildren<{ id: string; header: string }>) {
  return (
    <section
      className='p-6 border-b border-gray-200 dark:border-gray-800 last:border-0 group/section'
      id={id}
    >
      <h1 className='font-medium mb-4 text-sm flex items-center justify-between gap-1 text-gray-500'>
        {header}
        <Link
          to={`#${id}`}
          className={cn(
            buttonVariants({
              size: 'icon',
              variant: 'ghost',
              className:
                'opacity-0 group-hover/section:opacity-100 transition-all',
            }),
          )}
        >
          <LinkIcon className='w-3 h-3' />
        </Link>
      </h1>
      {children}
    </section>
  )
}
