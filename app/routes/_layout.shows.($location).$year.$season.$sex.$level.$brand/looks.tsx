import { Link, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { Bookmark } from 'lucide-react'
import { type RefObject, forwardRef, useRef } from 'react'
import { Key } from 'ts-key-enum'

import { SaveMenu } from 'components/save-menu'
import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { useOptionalUser, useRedirectTo } from 'utils/general'

import { type loader } from './route'

export function Looks({ className }: { className?: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <ol className={cn('flex whitespace-nowrap', className)}>
      {show.looks.map((look) => (
        <LookItem key={look.id} look={look} />
      ))}
    </ol>
  )
}

type Look = SerializeFrom<typeof loader>['looks'][number]

const SaveButton = forwardRef<HTMLElement, { look: Look }>(({ look }, ref) => {
  const user = useOptionalUser()
  const redirectTo = useRedirectTo()
  return user ? (
    <SaveMenu
      saveAPI={`/api/looks/${look.id}/save`}
      createAPI={`/api/looks/${look.id}/save/create`}
      sets={look.sets}
      ref={ref as RefObject<HTMLButtonElement>}
      aria-label='Save look'
    />
  ) : (
    <Link
      ref={ref as RefObject<HTMLAnchorElement>}
      className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      to={`/login?redirectTo=${redirectTo}`}
      prefetch='intent'
    >
      <Bookmark className='w-3 h-3' />
    </Link>
  )
})

function LookItem({ look }: { look: Look }) {
  const ref = useRef<HTMLElement>(null)
  return (
    <li className='aspect-person flex flex-col h-full pr-2'>
      <div
        role='button'
        tabIndex={-1}
        onClick={() => ref.current?.click()}
        onKeyDown={(event) => {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison */
          if (event.key === Key.Enter) ref.current?.click()
        }}
        className='cursor-default bg-gray-100 dark:bg-gray-900 h-full w-full overflow-hidden'
      >
        {look.images.length > 0 && (
          <img
            className='object-cover h-full w-full'
            loading='lazy'
            decoding='async'
            src={look.images[0].url}
            alt=''
          />
        )}
      </div>
      <div className='flex-none flex justify-between items-center py-1'>
        <p className='text-sm'>Look {look.number}</p>
        <SaveButton look={look} ref={ref} />
      </div>
    </li>
  )
}
