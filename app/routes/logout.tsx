import type { ActionArgs } from '@vercel/remix'
import { redirect } from '@vercel/remix'

import { logout } from 'session.server'

export async function action({ request }: ActionArgs) {
  return logout(request)
}

export function loader() {
  return redirect('/')
}
