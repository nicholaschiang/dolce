import { useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'

/**
 * Hook to automatically revalidate the page data on tab focus.
 * @see {@link https://sergiodxa.com/articles/automatic-revalidation-in-remix#revalidate-on-focus}
 */
export function useRevalidateOnFocus() {
  const { revalidate } = useRevalidator()

  useEffect(() => {
    function onFocus() {
      revalidate()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [revalidate])

  useEffect(() => {
    function onVisibilityChange() {
      revalidate()
    }
    window.addEventListener('visibilitychange', onVisibilityChange)
    return () =>
      window.removeEventListener('visibilitychange', onVisibilityChange)
  }, [revalidate])
}

/**
 * Hook to automatically revalidate the page data on network reconnection.
 * @see {@link https://sergiodxa.com/articles/automatic-revalidation-in-remix#revalidate-on-reconnect
 */
export function useRevalidateOnReconnect() {
  const { revalidate } = useRevalidator()
  useEffect(() => {
    function onReconnect() {
      revalidate()
    }
    window.addEventListener('online', onReconnect)
    return () => window.removeEventListener('online', onReconnect)
  }, [revalidate])
}
