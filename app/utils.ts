import { useRouteLoaderData } from '@remix-run/react'
import { type AppData, type SerializeFrom } from '@vercel/remix'
import rfdc from 'rfdc'

import type { User } from 'models/user.server'

import type { loader } from 'root'

const DEFAULT_REDIRECT = '/'
const BASE_URL = 'https://nicholas.engineering'

export const clone = rfdc()

export type Serialize<T extends AppData> = SerializeFrom<T> | T

/**
 * Swaps the keys and values of an object.
 * @param obj The object to swap.
 * @returns The swapped object.
 * @see {@link https://stackoverflow.com/a/23013726}
 */
export function invert<T extends string, U extends string>(
  obj: Record<T, U>,
): Record<U, T> {
  const ret: Partial<Record<U, T>> = {}
  Object.keys(obj).forEach((key) => {
    ret[obj[key as T]] = key as T
  })
  return ret as Record<U, T>
}

/**
 * Capitalizes the first letter of each word in the given string. Lowercases all
 * the other letters in each string (e.g. "RESORT 2024" -> "Resort 2024").
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function caps(sentence: string): string {
  return sentence
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join(' ')
}

/**
 * Resolve the given path to a fully qualified URL. If no path is provided, this
 * will return undefined. If the path is an empty string, this will return the
 * base URL of the site. This behavior is useful when resolving potentially
 * missing paths.
 * @example
 * ```ts
 * return {
 *   '@type': 'CreativeWork',
 *   '@id': look.id.toString(),
 *   'image': url(look.image?.url ?? undefined),
 * }
 * ```
 * @param path The path to resolve.
 * @returns The fully qualified URL.
 */
export function url(path: string): string
export function url(path: undefined | null): undefined
export function url(path: string | undefined | null): string | undefined
export function url(path: string | undefined | null): string | undefined {
  return path != null ? new URL(path, BASE_URL).toString() : undefined
}

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
  if (!to || typeof to !== 'string') return defaultRedirect
  if (!to.startsWith('/') || to.startsWith('//')) return defaultRedirect
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

export function useOptionalUser(): SerializeFrom<User> | undefined {
  const data = useData<typeof loader>('root')
  if (!data || !isUser(data.user)) return undefined
  return data.user
}

export function useUser(): SerializeFrom<User> {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    const error =
      'No user found in root loader, but user is required by useUser. If ' +
      'user is optional, try useOptionalUser instead.'
    throw new Error(error)
  }
  return maybeUser
}
