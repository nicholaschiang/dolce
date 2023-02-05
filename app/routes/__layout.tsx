import { Link, Outlet } from '@remix-run/react';
import { LightningBoltIcon } from '@radix-ui/react-icons';

import ThemeSwitcher from '~/components/theme-switcher';

function Header() {
  return (
    <header className='flex shrink-0 items-center justify-between border-b border-gray-200 bg-white/75 px-12 py-3 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/75'>
      <Link
        to='/'
        prefetch='intent'
        className='flex items-center justify-center'
      >
        <h1 className='leading-none'>nicholas.engineering</h1>
        <LightningBoltIcon className='ml-1.5 mr-0.5 h-3 w-3 text-gray-400 dark:text-gray-500' />
        <p className='mt-px text-3xs leading-none text-gray-400 dark:text-gray-500'>
          {new Date().toLocaleString(undefined, {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            timeZoneName: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          })}
        </p>
      </Link>
      <ThemeSwitcher />
    </header>
  );
}

export default function LayoutPage() {
  return (
    <main className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header />
      <Outlet />
    </main>
  );
}
