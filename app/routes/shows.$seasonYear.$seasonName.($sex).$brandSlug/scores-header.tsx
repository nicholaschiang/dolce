import { useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'

import { cn } from 'utils/cn'
import { type Score, getScorePercentage } from 'utils/scores'
import { getShowSeason } from 'utils/show'

import { type loader } from './route'

export function ScoresHeader() {
  const show = useLoaderData<typeof loader>()
  return (
    <div className='grid gap-2'>
      {show.video != null && (
        <>
          <video
            className='aspect-video w-full bg-gray-100 dark:bg-gray-900'
            preload='auto'
            controls
            autoPlay
            playsInline
            muted
            loop
          >
            <source src={show.video.url} type={show.video.mimeType} />
            Download the <a href={show.video.url}>MP4</a> video.
          </video>
          <link
            rel='preload'
            href={show.video.url}
            type={show.video.mimeType}
            as='video'
          />
        </>
      )}
      <div className='flex gap-2'>
        <div className='flex-none w-40 bg-gray-100 dark:bg-gray-900 h-0 min-h-full'>
          <img
            className='object-cover h-full w-full'
            src={show.looks[0].image.url}
            loading='eager'
            decoding='sync'
            alt=''
          />
        </div>
        <article className='flex-1 bg-gray-100 dark:bg-gray-900 text-center px-6 flex flex-col'>
          <h1 className='font-serif font-bold text-5xl mb-1 mt-8'>
            {show.brand.name}
          </h1>
          <h2 className='uppercase mb-6 text-sm'>{getShowSeason(show)}</h2>
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
        className={cn('flex-none w-20', score.totalCount === 0 && 'grayscale')}
        src={`/flowers/${img}.png`}
        alt=''
      />
      <div>
        <h2 className='text-5xl font-black font-serif'>
          {score.totalCount === 0 ? '--' : `${num}%`}
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
