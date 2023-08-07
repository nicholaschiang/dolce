import { Outlet } from '@remix-run/react'

import { type Handle } from 'root'

export const handle: Handle = {
  breadcrumb: () => ({ to: '/shows', children: 'shows' }),
}

export default function ShowsLayout() {
  return <Outlet />
}
