import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'

import { useUser } from 'routes/_header.$username'

import { ConsumerReview } from 'components/consumer-review'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const looks = await prisma.review.findMany({
    where: { author: { username: params.username } },
    include: { show: true },
    orderBy: { updatedAt: 'desc' },
  })
  return looks
}

export default function UserReviewsPage() {
  const reviews = useLoaderData<typeof loader>()
  const user = useUser()
  return (
    <ol className='grid gap-8'>
      {reviews.map((review) => (
        <li key={review.id}>
          <Link
            to={`/shows/${review.show.id}`}
            prefetch='intent'
            className='text-xs font-medium underline mb-2 block'
          >
            {review.show.name}
          </Link>
          <ConsumerReview
            author={user}
            content={review.content}
            updatedAt={review.updatedAt}
            score={review.score}
          />
        </li>
      ))}
    </ol>
  )
}
