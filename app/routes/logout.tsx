import { type ActionArgs, type LoaderArgs } from '@vercel/remix'

import { logout } from 'session.server'

export const config = { runtime: 'edge' }

export async function action({ request }: ActionArgs) {
  return logout(request)
}

export function loader({ request }: LoaderArgs) {
  return logout(request)
}
