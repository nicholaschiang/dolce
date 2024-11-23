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
  // TODO remove this "any" assertion once `remix-sitemap` has bumped the Remix
  // version to v2. I don't believe any actual changes need to be made.
  // @see {@link https://github.com/fedeya/remix-sitemap/pull/54}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  if (isSitemapUrl(request)) return sitemap(request, remixContext as any)
  responseHeaders.set('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  return handleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    <RemixServer context={remixContext} url={request.url} />,
  )
}
