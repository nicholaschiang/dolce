import { useLoaderData } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'

import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

export function CriticReviews() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header='Critic Reviews' id='critic-reviews'>
      {show.articles.length === 0 && (
        <Empty className='mt-2'>
          No critic reviews to show yet. Try checking back later.
        </Empty>
      )}
      {show.articles.length > 0 && (
        <ol className='mt-2 grid gap-4'>
          {show.articles.map((review) => (
            <li key={review.id}>
              <Review
                author={review.author}
                publication={review.publication.name}
                url={review.url}
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
  author: { name: string; url: string | null } | null
  publication: string
  url: string
  content: string
}

function Review({ author, publication, url, content }: ReviewProps) {
  return (
    <figure className='overflow-hidden bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800'>
      <figcaption className='p-3 text-center border-b border-gray-200 dark:border-gray-800 text-base'>
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
      <blockquote
        className='prose prose-sm prose-zinc dark:prose-invert p-3 m-auto'
        cite={url}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </figure>
  )
}
