import { useRouteLoaderData } from '@remix-run/react'
import type { AppData, SerializeFrom } from '@remix-run/server-runtime'
import rfdc from 'rfdc'

import type { User } from 'models/user.server'

import type { loader } from 'root'

export const clone = rfdc()

const DEFAULT_REDIRECT = '/'

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useData<T = AppData>(id: string): SerializeFrom<T> | undefined {
  return useRouteLoaderData<T>(id)
}

function isUser(user: unknown): user is User {
  return (
    !!user &&
    typeof user === 'object' &&
    typeof (user as User).email === 'string'
  )
}

export function useOptionalUser(): User | undefined {
  const data = useData<typeof loader>('root')
  if (!data || !isUser(data.user)) return undefined
  return data.user
}

export function useUser(): User {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    const error =
      'No user found in root loader, but user is required by useUser. If ' +
      'user is optional, try useOptionalUser instead.'
    throw new Error(error)
  }
  return maybeUser
}
