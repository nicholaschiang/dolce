import { type ActionArgs } from '@vercel/remix'

import { safeRedirect } from 'utils/general'

import { logout } from 'session.server'

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  return logout({ request, redirectTo })
}
