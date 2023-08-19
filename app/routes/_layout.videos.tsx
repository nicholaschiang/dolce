import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting videos...')
  const videos = await prisma.video.findMany({ take: 100 })
  log.debug('got %d videos', videos.length)
  return videos
}

export default function VideosPage() {
  const videos = useLoaderData<typeof loader>()
  return (
    <ListLayout title='videos'>
      {videos.map((video) => {
        const param = filterToSearchParam<'video', 'is'>({
          id: nanoid(5),
          name: 'video',
          condition: 'is',
          value: { id: video.id },
        })
        return (
          <li key={video.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {video.url}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
