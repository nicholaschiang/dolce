import { type ActionArgs } from '@vercel/remix'

import { logout } from 'session.server'
import { safeRedirect } from 'utils'

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  return logout({ request, redirectTo })
}
