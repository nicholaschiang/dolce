import { useMatches } from '@remix-run/react'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

import { type Handle } from 'root'

export function Breadcrumbs({ className }: { className?: string }) {
  const matches = useMatches()
  return (
    <nav className={className}>
      <ol className='flex items-center gap-2'>
        {matches
          .filter((match) => match.handle && match.handle.breadcrumb)
          .map((match, index) => (
            <Fragment key={match.id}>
              {index !== 0 && (
                <ChevronRight className='text-gray-300 dark:text-gray-600 h-3 w-3' />
              )}
              <li>{(match.handle as Handle).breadcrumb(match)}</li>
            </Fragment>
          ))}
      </ol>
    </nav>
  )
}
