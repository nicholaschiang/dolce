import { useLoaderData } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'

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
      <p className='mt-0.5 text-sm'>Look {look.number}</p>
    </li>
  )
}
