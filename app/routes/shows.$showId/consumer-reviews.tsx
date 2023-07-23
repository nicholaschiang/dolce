import { useLoaderData } from '@remix-run/react'

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
          No consumer reviews to show yet. Try submitting one above.
        </Empty>
      )}
      {reviews.length > 0 && (
        <ol className='mt-2 grid gap-4 grid-cols-2'>
          {reviews.map((review) => (
            <li key={review.id}>
              <Review
                score={review.score}
                author={review.author}
                content={review.content}
              />
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}

type ReviewProps = {
  author: { name: string; url: string | null }
  score: string
  content: string
}

function Review({ author, score, content }: ReviewProps) {
  return (
    <figure className='border border-gray-200 dark:border-gray-700 rounded-md'>
      <blockquote className='px-4 py-2'>
        <p className='font-medium'>{Math.floor(Number(score) * 100)}% Fresh</p>
        <p>{content}</p>
      </blockquote>
      <figcaption className='border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 py-2'>
        <cite>
          <span className='text-gray-500'>—</span>
          {author.url != null && (
            <a href={author.url} target='_blank' rel='noopener noreferrer'>
              {author.name}
            </a>
          )}
          {author.url == null && <span>{author.name}</span>}
        </cite>
      </figcaption>
    </figure>
  )
}
