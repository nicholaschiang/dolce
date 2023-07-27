import { ImageResponse } from '@vercel/og'
import { type LoaderArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { log } from 'log.server'

export const config = { runtime: 'edge' }

export async function loader({ params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      looks: { include: { image: true }, orderBy: { number: 'asc' }, take: 3 },
    },
  })
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  return new ImageResponse(
    (
      <div tw='flex flex-col bg-zinc-950 text-white items-center justify-center relative'>
        <div tw='flex items-center justify-center mb-6'>
          <div tw='font-bold text-xl ml-2'>{show.name}</div>
        </div>
        <div tw='flex'>
          {show.looks.map((look) => (
            <div key={look.id} tw='flex w-50 mr-2 border border-white'>
              <img
                src={look.image.url}
                alt=''
                tw='bg-white object-cover w-full'
              />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  )
}
