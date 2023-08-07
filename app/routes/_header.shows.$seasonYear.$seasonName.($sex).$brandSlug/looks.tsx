import { useFetcher, useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'
import { Bookmark } from 'lucide-react'

import { type action } from 'routes/api.looks.$lookId.save'

import { Button } from 'components/ui/button'

import { cn } from 'utils/cn'

import { type loader } from './route'

// Eagerly load images for the first three rows of looks (above the fold).
const rowsToEagerLoad = 3

// How many looks are shown in each row of results.
const looksPerRow = 2

export function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
      <ol
        className='grid gap-x-2 gap-y-6'
        style={{
          gridTemplateColumns: `repeat(${looksPerRow}, minmax(0, 1fr))`,
        }}
      >
        {show.looks.map((look) => (
          <LookItem key={look.id} look={look} />
        ))}
      </ol>
    </div>
  )
}

type Look = SerializeFrom<typeof loader>['looks'][number]

function LookItem({ look }: { look: Look }) {
  const index = look.number - 1
  const fetcher = useFetcher<typeof action>()

  // If you look at the loader function for this page, you'll notice that I
  // query for the sets that this look is included in that were authored by the
  // current user. If this length is greater than zero, then it is bookmarked.
  const isSaved =
    fetcher.state === 'idle'
      ? look.sets != null && look.sets.length > 0
      : fetcher.formMethod === 'POST'

  return (
    <li>
      <div className='bg-gray-100 dark:bg-gray-900 aspect-person'>
        <img
          className='object-cover h-full w-full'
          loading={index < looksPerRow * rowsToEagerLoad ? 'eager' : 'lazy'}
          decoding={index < looksPerRow * rowsToEagerLoad ? 'sync' : 'async'}
          src={look.images[0]?.url}
          alt=''
        />
      </div>
      <div className='flex justify-between items-center mt-1'>
        <p className='text-sm'>Look {look.number}</p>
        <fetcher.Form
          action={`/api/looks/${look.id}/save`}
          method={isSaved ? 'delete' : 'post'}
        >
          <Button type='submit' size='icon' variant='ghost'>
            <Bookmark
              className={cn(
                'w-3 h-3',
                isSaved && 'fill-gray-900 dark:fill-gray-100',
              )}
            />
          </Button>
        </fetcher.Form>
      </div>
    </li>
  )
}
