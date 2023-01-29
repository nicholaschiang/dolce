import { Link, Outlet } from '@remix-run/react';

import ThemeSwitcher from '~/components/theme-switcher';

function Header() {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/50 px-12 py-6 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/50'>
      <Link to='/' prefetch='intent'>
        <h1 className='text-2xl'>nicholas.engineering</h1>
        <p className='text-xs'>2023 january</p>
      </Link>
      <ThemeSwitcher />
    </header>
  );
}

export default function LayoutPage() {
  return (
    <>
      <Header />
      <main className='px-12 py-6'>
        <Outlet />
      </main>
    </>
  );
}
