import { type PropsWithChildren } from 'react'

import { Italy } from './italy'

export function Hero() {
  return (
    <main className='flex flex-col sm:flex-row sm:items-center justify-center mt-6 p-6 gap-6'>
      <div className='aspect-square w-full sm:w-72 sm:h-72 bg-gray-100 dark:bg-gray-900'>
        <img src='/brands.jpg' className='object-cover h-full w-full' alt='' />
      </div>
      <article>
        <h1 className='text-2xl font-medium mb-4 tracking-tighter flex items-center gap-0.5'>
          <span>dol</span>
          <span>·</span>
          <span>ce</span>
        </h1>
        <dl>
          <Definition label='adverb'>
            (especially as a direction) sweetly and softly.
          </Definition>
          <Definition label='adjective'>
            performed in a sweet and soft manner.
          </Definition>
          <Definition label='origin'>
            <Italy className='border border-gray-900 dark:border-white rounded-full mt-1' />
          </Definition>
        </dl>
      </article>
    </main>
  )
}

function Definition({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <>
      <dt className='italic text-gray-400 dark:text-gray-600'>{label}</dt>
      <dd className='mb-4'>{children}</dd>
    </>
  )
}
