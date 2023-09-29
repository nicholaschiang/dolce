import { useLoaderData } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { useId } from 'react'

import { Empty } from 'components/empty'
import { LayoutSection } from 'components/layout'

import { type loader } from './route'

export function CriticReviews() {
  const show = useLoaderData<typeof loader>()
  return (
    <>
      <LayoutSection
        header='Critic Reviews'
        id='critic-reviews'
        className='pb-0 border-0'
      />
      {show.articles.length === 0 && (
        <Empty className='mx-6 mb-6'>
          No critic reviews to show yet. Try checking back later.
        </Empty>
      )}
      {show.articles.map((review) => (
        <Review
          key={review.id}
          author={review.author}
          publication={review.publication.name}
          url={review.url}
          content={review.content}
        />
      ))}
    </>
  )
}

type ReviewProps = {
  author: { name: string; url: string | null } | null
  publication: string
  url: string
  content: string
}

function Review({ author, publication, url, content }: ReviewProps) {
  const id = useId()
  return (
    <>
      <figcaption
        id={id}
        className='p-3 text-center border border-gray-200 dark:border-gray-800 text-base mx-6 rounded-t sticky -top-1 bg-gray-100 dark:bg-gray-900'
      >
        <cite className='underline underline-offset-4 decoration-2 decoration-gray-300 dark:decoration-gray-600'>
          {author != null && (
            <>
              <span className='text-gray-500'>By </span>
              {author.url != null && (
                <a href={author.url} target='_blank' rel='noopener noreferrer'>
                  {author.name}
                </a>
              )}
              {author.url == null && <span>{author.name}</span>}
              <span className='text-gray-500'> for </span>
            </>
          )}
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2'
          >
            {publication}
            <ExternalLink className='w-4 h-4' />
          </a>
        </cite>
      </figcaption>
      <figure
        aria-labelledby={id}
        className='overflow-hidden mx-6 mb-6 bg-gray-100 dark:bg-gray-900 rounded-b border-b border-x border-gray-200 dark:border-gray-800'
      >
        <blockquote
          className='prose prose-sm prose-zinc dark:prose-invert p-3 m-auto'
          cite={url}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </figure>
    </>
  )
}
