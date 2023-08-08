import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@vercel/remix'
import { handleRequest } from '@vercel/remix'
import { createSitemapGenerator } from 'remix-sitemap'

import { BASE_URL } from 'utils/general'

const { isSitemapUrl, sitemap } = createSitemapGenerator({
  siteUrl: BASE_URL,
  generateRobotsTxt: true,
})

export default function entry(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  if (isSitemapUrl(request)) return sitemap(request, remixContext)
  responseHeaders.set('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    <RemixServer context={remixContext} url={request.url} />,
  )
}
