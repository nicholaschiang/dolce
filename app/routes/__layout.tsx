import { Link, Outlet } from '@remix-run/react'

import ThemeSwitcher from 'components/theme-switcher'

function Header() {
  return (
    <header className='relative shrink-0 border-b border-gray-200 bg-white/75 px-12 py-3 text-center backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/75'>
      <h1 className='leading-none'>
        <Link to='/' prefetch='intent'>
          nicholas.engineering
        </Link>
      </h1>
      <p className='mt-px text-3xs leading-none text-gray-400 dark:text-gray-500'>
        a project by{' '}
        <a
          href='https://nicholaschiang.com'
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          nicholas chiang
        </a>
      </p>
      <div className='absolute inset-y-0 right-12 flex items-center'>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

export default function LayoutPage() {
  return (
    <main className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header />
      <Outlet />
    </main>
  )
}
