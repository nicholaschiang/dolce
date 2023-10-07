import { Outlet } from '@remix-run/react'

import { Header } from 'components/header'

export default function LayoutPage() {
  return (
    <main className='fixed inset-0 flex flex-col overflow-hidden'>
      <Header className='flex-none' />
      <Outlet />
    </main>
  )
}
