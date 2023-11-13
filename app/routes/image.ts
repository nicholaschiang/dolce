import type { LoaderFunction } from '@vercel/remix'

import { OPTIMIZE_IMAGES } from 'utils/general'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const route = '_vercel/image'
  return fetch(
    OPTIMIZE_IMAGES && process.env.VERCEL
      ? `${url.protocol}//${url.host}/${route}?${url.searchParams.toString()}`
      : decodeURIComponent(url.searchParams.get('url') ?? ''),
  )
}
