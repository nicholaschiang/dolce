import { Outlet } from '@remix-run/react'

import { Header } from 'components/header'

export default function HeaderLayout() {
  return (
    <>
      <Header className='sticky top-0' />
      <Outlet />
    </>
  )
}
