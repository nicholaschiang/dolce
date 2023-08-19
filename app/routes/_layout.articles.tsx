import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting articles...')
  const articles = await prisma.article.findMany({ take: 100 })
  log.debug('got %d articles', articles.length)
  return articles
}

export default function ArticlesPage() {
  const articles = useLoaderData<typeof loader>()
  return (
    <ListLayout title='articles'>
      {articles.map((article) => {
        const param = filterToSearchParam<'articles', 'some'>({
          id: nanoid(5),
          name: 'articles',
          condition: 'some',
          value: { id: article.id, title: article.title },
        })
        return (
          <li key={article.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {article.title}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
