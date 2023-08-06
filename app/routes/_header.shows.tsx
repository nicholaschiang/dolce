import { Link, Outlet } from '@remix-run/react'

import { type Handle } from 'root'

export const handle: Handle = {
  breadcrumb: () => (
    <Link prefetch='intent' to='/shows'>
      shows
    </Link>
  ),
}

export default function ShowsLayout() {
  return <Outlet />
}
