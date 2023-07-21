import { Link, Outlet } from '@remix-run/react'

import { type Handle } from 'root'

export const config = { runtime: 'edge' }

export const handle: Handle = {
  breadcrumb: () => <Link to='/shows'>shows</Link>,
}

export default function ShowsLayout() {
  return <Outlet />
}
