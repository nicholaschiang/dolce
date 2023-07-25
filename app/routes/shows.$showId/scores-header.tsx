import { useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'
import { Sex } from '@prisma/client'

import { prisma } from 'db.server'
import { cn } from 'utils/cn'

import { type loader } from './route'

type Score = {
  positiveCount: number
  negativeCount: number
  neutralCount: number
  totalCount: number
}
type Scores = { critic: Score; consumer: Score }

function sanityCheck(score: Score, name: string): void {
  const sum = score.positiveCount + score.negativeCount + score.neutralCount
  if (sum !== score.totalCount) {
    const error =
      `${name} total (${score.totalCount}) did not match sum ` +
      `(${score.positiveCount} + ${score.negativeCount} + ` +
      `${score.neutralCount} = ${sum})`
    throw new Error(error)
  }
}

export async function getScores(showId: number): Promise<Scores> {
  const [total, positive, neutral, negative] = await Promise.all([
    prisma.review.count({
      where: { showId },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { gt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { equals: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { lt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
  ])
  const scores = {
    critic: {
      positiveCount: positive.publicationId,
      negativeCount: negative.publicationId,
      neutralCount: neutral.publicationId,
      totalCount: total.publicationId,
    },
    consumer: {
      /* eslint-disable no-underscore-dangle */
      positiveCount: positive._all - positive.publicationId,
      negativeCount: negative._all - negative.publicationId,
      neutralCount: neutral._all - neutral.publicationId,
      totalCount: total._all - total.publicationId,
      /* eslint-enable no-underscore-dangle */
    },
  }
  sanityCheck(scores.critic, 'Critic Score')
  sanityCheck(scores.consumer, 'Consumer Score')
  return scores
}

export function ScoresHeader() {
  const show = useLoaderData<typeof loader>()
  const sex = show.collections
    .map((collection) => collection.sex)
    .every((value) => value === Sex.MAN)
    ? 'Menswear'
    : ''
  return (
    <div className='grid gap-2'>
      <video
        className='aspect-video w-full bg-gray-100 dark:bg-gray-900'
        controls
        autoPlay
        playsInline
        muted
      >
        <source src={show.video.url} type={show.video.mimeType} />
        Download the <a href={show.video.url}>MP4</a> video.
      </video>
      <div className='flex gap-2'>
        <div className='flex-none w-40 bg-gray-100 dark:bg-gray-900 h-0 min-h-full'>
          <img
            className='object-cover h-full'
            src={show.looks[0].image.url}
            alt=''
          />
        </div>
        <article className='flex-1 bg-gray-100 dark:bg-gray-900 text-center px-6 flex flex-col'>
          <h1 className='font-serif font-bold text-5xl mb-1 mt-8'>
            {show.brands.map((brand) => brand.name).join(', ')}
          </h1>
          <h2 className='uppercase mb-6 text-sm'>
            {show.season.name.replace('_', '-')} {show.season.year} {sex}
          </h2>
          <ul className='grid grid-cols-2 gap-2 mt-auto'>
            <ScoreItem score={show.scores.critic} name='Critic Score' />
            <ScoreItem score={show.scores.consumer} name='Consumer Score' />
          </ul>
        </article>
      </div>
    </div>
  )
}

type ScoreItemProps = { score: Score; name: string }

function ScoreItem({ score, name }: ScoreItemProps) {
  const num = useMemo(
    () => score.positiveCount / score.totalCount,
    [score.positiveCount, score.totalCount],
  )
  const img = useMemo(() => {
    if (score.totalCount === 0) return '70'
    if (num >= 0.9) return '90'
    if (num >= 0.8) return '80'
    if (num >= 0.7) return '70'
    if (num >= 0.6) return '60'
    if (num >= 0.5) return '50'
    return '40'
  }, [num, score.totalCount])
  return (
    <li className='flex gap-2 justify-center'>
      <img
        className={cn('flex-none w-20', score.totalCount === 0 && 'grayscale')}
        src={`/flowers/${img}.png`}
        alt=''
      />
      <div>
        <h2 className='text-5xl font-black font-serif'>
          {score.totalCount === 0 ? '--' : `${Math.floor(num * 100)}%`}
        </h2>
        <p className='text-xs font-semibold uppercase'>{name}</p>
        <p className='text-xs'>
          {score.totalCount === 0
            ? 'No Reviews'
            : `${score.totalCount} Reviews`}
        </p>
      </div>
    </li>
  )
}
