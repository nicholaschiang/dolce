import { useLoaderData } from '@remix-run/react'

import { ConsumerReview } from 'components/consumer-review'
import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

export function ConsumerReviews() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header={`Consumer reviews for ${show.name}`} id='consumer-reviews'>
      {show.reviews.length === 0 && (
        <Empty className='mt-2'>
          There are no consumer reviews yet. Try submitting one above.
        </Empty>
      )}
      {show.reviews.length > 0 && (
        <ol className='mt-2 grid gap-4'>
          {show.reviews.map((review) => (
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
    </Section>
  )
}
