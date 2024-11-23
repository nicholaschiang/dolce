import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@vercel/remix'

import { ListLayout } from 'components/list-layout'

import { getTagFilter, getTagName } from 'utils/variant'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam, getSearch } from 'filters'
import { log } from 'log.server'

export async function loader({ request }: LoaderFunctionArgs) {
  log.debug('getting tags...')
  const search = getSearch(request)
  const tags = await prisma.tag.findMany({
    take: 100,
    where: search ? { name: { search } } : undefined,
  })
  log.debug('got %d tags', tags.length)
  return tags
}

export default function TagsPage() {
  const tags = useLoaderData<typeof loader>()
  return (
    <ListLayout title='variants'>
      {tags.map((tag) => {
        const param = filterToSearchParam<'variants', 'some'>(getTagFilter(tag))
        return (
          <li key={tag.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {getTagName(tag)}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
