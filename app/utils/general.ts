import { useLocation, useRouteLoaderData, useNavigate } from '@remix-run/react'
import { type AppData, type SerializeFrom } from '@vercel/remix'
import { useEffect, useLayoutEffect as useReactLayoutEffect } from 'react'
import rfdc from 'rfdc'

import type { User } from 'models/user.server'

import type { loader } from 'root'

export const NAME = 'DOLCE'
export const DEFAULT_REDIRECT = '/'
export const BASE_URL = 'https://dolce.so'
export const OPTIMIZE_IMAGES = false

export const clone = rfdc()

export type Serialize<T extends AppData> = SerializeFrom<T> | T

export const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : useReactLayoutEffect

/**
 * Get the `redirectTo` query parameter that will send the user back to their
 * current location. Added for convenience (to avoid having to type this out
 * each time I add a login link).
 * @returns The `redirectTo` query parameter.
 */
export function useRedirectTo(options?: { hash?: string }): string {
  const location = useLocation()
  const hash = options?.hash ?? location.hash
  const path = `${location.pathname}${location.search}${hash}`
  return encodeURIComponent(path)
}

/**
 * Filter out duplicate elements in the array by some unique key.
 * @param array Array to filter
 * @param key Unique key to filter by
 * @returns Filtered array
 * @see {@link https://stackoverflow.com/a/9229821}
 */
export function uniq<T>(a: T[], key: (item: T) => string | number): T[] {
  const seen = new Set()
  return a.filter((item) => {
    const k = key(item)
    return seen.has(k) ? false : seen.add(k)
  })
}

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
 * This should be used any time the redirect path is user-provided (like the
 * query string on our login/signup pages). This avoids open-redirect
 * vulnerabilities.
 *
 * This function will also try to `decodeURIComponent` (for redirect paths that
 * came from the `useRedirectTo` hook). AFAIK this shouldn't cause any problems,
 * but in case it does, I should add an encode boolean flag on `useRedirectTo`.
 *
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== 'string') return defaultRedirect
  const parsed = to ? decodeURIComponent(to) : to
  if (!parsed.startsWith('/') || parsed.startsWith('//')) return defaultRedirect
  return parsed
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

export function useOptionalUser(): SerializeFrom<User> | undefined {
  const data = useData<typeof loader>('root')
  return data?.user ?? undefined
}

export function useUser(): SerializeFrom<User> {
  const maybeUser = useOptionalUser()
  const nav = useNavigate()
  const redirectTo = useRedirectTo()
  if (maybeUser == null) {
    nav(`/login?redirectTo=${redirectTo}`)
    throw new Error('User is not logged in; redirecting to login page...')
  }
  return maybeUser
}
