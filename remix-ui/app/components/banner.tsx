import { type PropsWithChildren } from 'react'

export function Banner({ children }: PropsWithChildren) {
  return (
    <article className='border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-6 py-3 bg-gray-50 dark:bg-gray-900 text-xs'>
      {children}
    </article>
  )
}
