import type { EntryContext } from '@vercel/remix'
import { RemixServer } from '@remix-run/react'
import { handleRequest } from '@vercel/remix'

export default function entry(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    <RemixServer context={remixContext} url={request.url} />,
  )
}
