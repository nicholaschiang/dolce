import { type ActionFunctionArgs } from '@vercel/remix'

import { safeRedirect } from 'utils/general'

import { logout } from 'session.server'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  return logout({ request, redirectTo })
}
