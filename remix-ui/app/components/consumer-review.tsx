import { type User } from '@prisma/client'
import { Link } from '@remix-run/react'
import { type SerializeFrom } from '@vercel/remix'

import { Avatar } from 'components/avatar'
import { TimeAgo } from 'components/time-ago'

export function ConsumerReview({
  author,
  content,
  updatedAt,
  score,
}: {
  author: SerializeFrom<User>
  content: string
  updatedAt: string
  score?: string | null
}) {
  return (
    <figure className='flex gap-2'>
      <Avatar src={author} />
      <div>
        <figcaption className='flex items-center gap-1'>
          <cite className='text-2xs not-italic font-semibold'>
            {author.username ? (
              <Link to={`/${author.username}`} prefetch='intent'>
                {author.username}
              </Link>
            ) : (
              <span>{author.name}</span>
            )}
          </cite>
          <TimeAgo
            locale='en_short'
            className='text-gray-400 dark:text-gray-500 text-3xs'
            datetime={updatedAt}
          />
        </figcaption>
        <blockquote className='text-sm'>
          {score != null && (
            <strong className='font-medium mr-1'>{Number(score) * 5}/5</strong>
          )}
          {content}
        </blockquote>
      </div>
    </figure>
  )
}
