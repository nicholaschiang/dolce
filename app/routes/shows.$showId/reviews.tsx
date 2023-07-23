import { useLoaderData } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'

import { type loader } from './route'
import { Section } from './section'

export function Reviews() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header={`Critic reviews for ${show.name}`}>
      <ol className='mt-2 grid gap-4'>
        {show.reviews
          .filter((r) => r.publication != null && r.url != null)
          .map((review) => (
            <li key={review.id}>
              <Review
                author={review.author}
                publication={review.publication?.name as string}
                url={review.url as string}
                content={review.content}
              />
            </li>
          ))}
      </ol>
    </Section>
  )
}

type ReviewProps = {
  author: { name: string; url: string | null }
  publication: string
  url: string
  content: string
}

function Review({ author, publication, url, content }: ReviewProps) {
  return (
    <figure className='flex-none bg-gray-100 dark:bg-gray-800 overflow-hidden pb-4'>
      <figcaption className='mt-8 text-center'>
        <cite className='text-lg underline underline-offset-4 decoration-2 decoration-gray-300 dark:decoration-gray-600'>
          <span className='text-gray-500'>By </span>
          {author.url != null && (
            <a href={author.url} target='_blank' rel='noopener noreferrer'>
              {author.name}
            </a>
          )}
          {author.url == null && <span>{author.name}</span>}
          <span className='text-gray-500'> for </span>
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
        className='prose prose-zinc dark:prose-invert p-6 m-auto'
        cite={url}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </figure>
  )
}
