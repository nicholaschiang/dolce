import { useLoaderData } from '@remix-run/react'
import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js'
import en from 'timeago.js/lib/lang/en_short'

import { Avatar } from 'components/avatar'
import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

timeago.register('en_short', en)

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
              <figure className='flex gap-2'>
                <Avatar src={review.author} />
                <div>
                  <figcaption className='flex items-center gap-1'>
                    <cite className='text-2xs not-italic font-semibold'>
                      {review.author.url != null && (
                        <a
                          href={review.author.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {review.author.username}
                        </a>
                      )}
                      {review.author.url == null && (
                        <span>{review.author.username}</span>
                      )}
                    </cite>
                    <TimeAgo
                      locale='en_short'
                      className='text-gray-400 dark:text-gray-500 text-3xs'
                      datetime={review.updatedAt}
                    />
                  </figcaption>
                  <blockquote className='text-sm'>
                    <strong className='font-medium mr-1'>
                      {Number(review.score) * 5}/5
                    </strong>
                    {review.content}
                  </blockquote>
                </div>
              </figure>
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
