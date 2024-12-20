import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { type Video as VideoT } from '@prisma/client'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useRef, useEffect, useState } from 'react'
import { z } from 'zod'

import { type action as videoAPI } from 'routes/api.shows.$showId.video'

import { cn } from 'utils/cn'
import { type Serialize, useOptionalUser } from 'utils/general'

import { supabase } from 'db.client'

import { type loader } from './route'

export function Video({ className }: { className?: string }) {
  const collection = useLoaderData<typeof loader>()
  const user = useOptionalUser()
  return collection.shows[0]?.video ? (
    <div className={className}>
      <VideoPlayer video={collection.shows[0]?.video} />
    </div>
  ) : user?.curator ? (
    <div className={className}>
      <VideoForm />
    </div>
  ) : null
}

function VideoPlayer({ video }: { video: Serialize<VideoT> }) {
  return (
    <>
      <video
        className='aspect-video w-full bg-gray-100 dark:bg-gray-900 flex-none'
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

const schema = z.object({
  video: z
    .instanceof(File)
    .refine((file) => file.name !== '' && file.size > 0, 'Video is required')
    .refine((file) => file.size < 5e9, 'Video cannot be larger than 5 GB'),
})

function VideoForm() {
  const collection = useLoaderData<typeof loader>()
  const showId = collection.shows[0]?.id
  const action = `/api/shows/${showId}/video`
  const fetcher = useFetcher<typeof videoAPI>()
  const [file, setFile] = useState<File>()
  const [uploading, setUploading] = useState(false)
  const loading = uploading || fetcher.state !== 'idle'

  // Actually upload the file to Supabase Storage. The action only creates a
  // signed upload URL that is then used client-side to perform the upload.
  const uploaded = useRef(file)
  useEffect(() => {
    async function upload() {
      if (fetcher.data?.token && file && uploaded.current !== file) {
        setUploading(true)
        uploaded.current = file
        const { data } = await supabase.storage
          .from('videos')
          .uploadToSignedUrl(`shows/${showId}`, fetcher.data?.token, file)
        if (data)
          fetcher.submit(
            { path: data.path, mimeType: file.type },
            { action, method: 'PATCH' },
          )
        setUploading(false)
      }
    }
    void upload()
  }, [file, showId, action, fetcher])

  const [form, { video }] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    onSubmit(event, { formData }) {
      event.preventDefault()
      const submission = parseWithZod(formData, { schema })
      if (submission.status === 'success') {
        const videoFile = submission.value.video
        setFile(videoFile)
        fetcher.submit({}, { action, method: 'POST' })
      }
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <form
      className={cn(
        'relative aspect-video w-full bg-gray-100 dark:bg-gray-900',
        loading && 'animate-pulse',
      )}
      onChange={(event) => event.currentTarget.requestSubmit()}
      {...getFormProps(form)}
    >
      <button
        type='button'
        className='absolute inset-0 w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm'
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading
          ? 'Uploading video...'
          : video.errors ?? 'Click to upload collection video'}
      </button>
      <input
        ref={inputRef}
        name={video.name}
        className='hidden'
        accept='video/*'
        type='file'
        required
      />
    </form>
  )
}
