import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Link } from '@remix-run/react'
import cn from 'classnames'
import type { ReactNode } from 'react'

import { ThemeSwitcher } from 'components/theme-switcher'

export type RootProps = { children: ReactNode; className?: string }

export function Root({ children, className }: RootProps) {
  return (
    <header
      className={cn(
        'flex shrink-0 items-center justify-center border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/75',
        className,
      )}
    >
      {children}
    </header>
  )
}

export type ContentProps = { className?: string }

export function Content({ className }: ContentProps) {
  return (
    <div className={cn('relative m-6 w-full', className)}>
      <h1 className='text-xl leading-none'>
        <Link to='/' prefetch='intent'>
          nicholas.engineering
        </Link>
      </h1>
      <p className='mt-px text-sm leading-none text-gray-400 dark:text-gray-500'>
        a project by{' '}
        <a
          href='https://nicholaschiang.com'
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          nicholas chiang
          <ArrowTopRightIcon className='inline-block h-2 w-2' />
        </a>
      </p>
      <div className='absolute inset-y-0 right-0 flex items-center'>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
