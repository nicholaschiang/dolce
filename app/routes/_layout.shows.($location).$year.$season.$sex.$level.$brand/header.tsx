import { useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'

import { cn } from 'utils/cn'
import { type Score, getScorePercentage } from 'utils/scores'
import { getShowSeason } from 'utils/show'

import { type loader } from './route'

export function Header() {
  const show = useLoaderData<typeof loader>()
  return (
    <article className='bg-gray-100 dark:bg-gray-900 text-center px-6 flex flex-col border-b border-gray-200 dark:border-gray-800'>
      <h1 className='font-serif font-bold text-2xl md:text-3xl lg:text-5xl mb-1 mt-8'>
        {show.brand.name}
      </h1>
      <h2 className='uppercase mb-6 text-sm'>{getShowSeason(show)}</h2>
      <ul className='grid grid-cols-2 gap-2 mt-auto'>
        <ScoreItem score={show.scores.critic} name='Critic Score' />
        <ScoreItem score={show.scores.consumer} name='Consumer Score' />
      </ul>
    </article>
  )
}

type ScoreItemProps = { score: Score; name: string }

function ScoreItem({ score, name }: ScoreItemProps) {
  const num = useMemo(() => getScorePercentage(score), [score])
  const img = useMemo(() => {
    if (score.totalCount === 0) return '70'
    if (num >= 90) return '90'
    if (num >= 80) return '80'
    if (num >= 70) return '70'
    if (num >= 60) return '60'
    if (num >= 50) return '50'
    return '40'
  }, [num, score.totalCount])
  return (
    <li className='flex gap-2 justify-center'>
      <img
        className={cn(
          'hidden lg:block flex-none w-20',
          score.totalCount === 0 && 'grayscale',
        )}
        src={`/flowers/${img}.png`}
        alt=''
      />
      <div className='mb-6 lg:mb-0'>
        <h2 className='text-3xl lg:text-5xl font-black font-serif'>
          {score.totalCount === 0 ? '--' : `${num}%`}
        </h2>
        <p className='text-3xs lg:text-xs font-semibold uppercase'>{name}</p>
        <p className='text-3xs lg:text-xs'>
          {score.totalCount === 0
            ? 'No Reviews'
            : `${score.totalCount} Reviews`}
        </p>
      </div>
    </li>
  )
}
