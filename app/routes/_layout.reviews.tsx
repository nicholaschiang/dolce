import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting reviews...')
  const reviews = await prisma.review.findMany({ take: 100 })
  log.debug('got %d reviews', reviews.length)
  return reviews
}

export default function ReviewsPage() {
  const reviews = useLoaderData<typeof loader>()
  return (
    <ListLayout title='reviews'>
      {reviews.map((review) => {
        const param = filterToSearchParam<'reviews', 'some'>({
          id: nanoid(5),
          name: 'reviews',
          condition: 'some',
          value: { id: review.id },
        })
        return (
          <li key={review.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {review.content}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
