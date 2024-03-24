import { useLoaderData } from '@remix-run/react'

import { ConsumerReview } from 'components/consumer-review'
import { Empty } from 'components/empty'
import { LayoutSection } from 'components/layout'

import { type loader } from './route'

export function ConsumerReviews() {
  const collection = useLoaderData<typeof loader>()
  return (
    <LayoutSection header='Consumer Reviews' id='consumer-reviews'>
      {collection.reviews.length === 0 && (
        <Empty className='mt-2'>
          There are no consumer reviews yet. Try submitting one above.
        </Empty>
      )}
      {collection.reviews.length > 0 && (
        <ol className='mt-2 grid gap-4'>
          {collection.reviews.map((review) => (
            <li key={review.id}>
              <ConsumerReview
                author={review.author}
                content={review.content}
                updatedAt={review.updatedAt}
                score={review.score}
              />
            </li>
          ))}
        </ol>
      )}
    </LayoutSection>
  )
}
