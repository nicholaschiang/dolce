import { useLoaderData } from '@remix-run/react'

import { ConsumerReview } from 'components/consumer-review'
import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

export function ConsumerReviews() {
  const show = useLoaderData<typeof loader>()
  const reviews = show.reviews.filter((r) => r.publication == null)
  return (
    <Section header={`Consumer reviews for ${show.name}`} id='consumer-reviews'>
      {reviews.length === 0 && (
        <Empty className='mt-2'>
          There are no consumer reviews yet. Try submitting one above.
        </Empty>
      )}
      {reviews.length > 0 && (
        <ol className='mt-2 grid gap-4'>
          {reviews.slice(0, 5).map((review) => (
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
