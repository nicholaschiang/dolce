import { type DataFunctionArgs, json } from '@vercel/remix'

import { prisma, supabase } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function action({ request, params }: DataFunctionArgs) {
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null) throw new Response('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user == null) throw new Response('Not Found', { status: 404 })
  if (user.curator === false) throw new Response('Forbidden', { status: 403 })

  switch (request.method) {
    case 'POST': {
      log.info('Generating signed video upload URL for show... %o', params)

      const path = `shows/${showId}`
      const { data, error } = await supabase.storage
        .from('videos')
        .createSignedUploadUrl(path)

      if (error) {
        log.error(`Failed to generate signed video upload URL: %s`, error.stack)
        throw new Response(error.message, { status: 500 })
      }

      log.info('Generated signed video upload URL for show (%d).', showId)
      return json({ token: data.token }, { status: 201 })
    }
    case 'PATCH': {
      log.info('Updating video for show... %o', params)

      const formData = await request.formData()
      const path = formData.get('path')
      if (typeof path !== 'string')
        throw new Response('Bad Request', { status: 400 })
      const mimeType = formData.get('mimeType')
      if (typeof mimeType !== 'string')
        throw new Response('Bad Request', { status: 400 })

      const video = supabase.storage.from('videos').getPublicUrl(path)
      const url = video.data.publicUrl
      await prisma.show.update({
        where: { id: showId },
        data: {
          video: {
            connectOrCreate: {
              where: { url },
              create: { url, mimeType },
            },
          },
        },
      })

      log.info('Updated video for show (%d): %s', showId, url)
      return json({ token: null }, { status: 200 })
    }
    default:
      throw new Response('Method Not Allowed', { status: 405 })
  }
}
