import type { ActionFunction } from '@remix-run/node'

import { getSession, sessionStorage } from 'session.server'
import { isTheme } from 'theme'

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request)
  const requestText = await request.text()
  const form = new URLSearchParams(requestText)
  const theme = form.get('theme')
  if (isTheme(theme)) session.set('theme', theme)
  const headers = { 'Set-Cookie': await sessionStorage.commitSession(session) }
  return new Response(null, { headers, status: 200 })
}
