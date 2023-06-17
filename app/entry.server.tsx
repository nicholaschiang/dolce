import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@vercel/remix'
import { handleRequest } from '@vercel/remix'

export default function entry(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  responseHeaders.set('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    <RemixServer context={remixContext} url={request.url} />,
  )
}
