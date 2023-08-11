import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { type Video } from '@prisma/client'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useRef, useMemo } from 'react'
import { z } from 'zod'

import { type action as videoAPI } from 'routes/api.shows.$showId.video'

import { cn } from 'utils/cn'
import { type Serialize, useOptionalUser } from 'utils/general'
import { type Score, getScorePercentage } from 'utils/scores'
import { getShowSeason } from 'utils/show'

import { type loader } from './route'

export const schema = z.object({
  video: z
    .instanceof(File)
    .refine((file) => file.name !== '' && file.size > 0, 'Video is required')
    .refine((file) => file.size < 5e9, 'Video cannot be larger than 5 GB'),
})

export function ScoresHeader() {
  const show = useLoaderData<typeof loader>()
  const user = useOptionalUser()
  return (
    <div className='grid gap-2'>
      {show.video ? (
        <VideoPlayer video={show.video} />
      ) : user?.curator ? (
        <VideoForm />
      ) : null}
      <div className='flex gap-2'>
        <div className='flex-none w-40 bg-gray-100 dark:bg-gray-900 h-0 min-h-full'>
          {show.looks.length > 0 && show.looks[0].images.length > 0 && (
            <img
              className='object-cover h-full w-full'
              src={show.looks[0].images[0].url}
              loading='eager'
              decoding='sync'
              alt=''
            />
          )}
        </div>
        <article className='flex-1 bg-gray-100 dark:bg-gray-900 text-center px-6 flex flex-col'>
          <h1 className='font-serif font-bold text-2xl md:text-3xl lg:text-5xl mb-1 mt-8'>
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

function VideoPlayer({ video }: { video: Serialize<Video> }) {
  return (
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
        <source src={video.url} type={video.mimeType} />
        Download the <a href={video.url}>MP4</a> video.
      </video>
      <link rel='preload' href={video.url} type={video.mimeType} as='video' />
    </>
  )
}

function VideoForm() {
  const fetcher = useFetcher<typeof videoAPI>()
  const [form, { video }] = useForm({
    lastSubmission: fetcher.data,
    onValidate({ formData }) {
      return parse(formData, { schema, stripEmptyValue: true })
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const show = useLoaderData<typeof loader>()
  return (
    <fetcher.Form
      method='post'
      action={`/api/shows/${show.id}/video`}
      encType='multipart/form-data'
      className={cn(
        'relative aspect-video w-full bg-gray-100 dark:bg-gray-900',
        fetcher.state !== 'idle' && 'animate-pulse',
      )}
      onChange={(event) => fetcher.submit(event.currentTarget)}
      {...form.props}
    >
      <button
        type='button'
        className='absolute inset-0 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm'
        disabled={fetcher.state !== 'idle'}
        onClick={() => inputRef.current?.click()}
      >
        {fetcher.state !== 'idle'
          ? 'Uploading video...'
          : video.error ?? 'Click to upload show video'}
      </button>
      <input
        ref={inputRef}
        name={video.name}
        className='hidden'
        accept='video/*'
        type='file'
        required
      />
    </fetcher.Form>
  )
}
