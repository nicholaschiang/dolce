import { parse } from '@conform-to/zod'
import { type ActionArgs, json } from '@vercel/remix'

import { schema } from 'routes/_header.shows.($location).$year.$season.$sex.$level.$brand/header'

import { prisma, supabase } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function action({ request, params }: ActionArgs) {
  log.info('Updating video for show... %o', params)
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null) throw new Response('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user == null) throw new Response('Not Found', { status: 404 })
  if (user.id !== userId) throw new Response('Forbidden', { status: 403 })
  if (user.curator === false) throw new Response('Forbidden', { status: 403 })

  const formData = await request.formData()
  const submission = parse(formData, { schema, stripEmptyValue: true })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(`shows/${showId}`, submission.value.video, { upsert: true })

  if (error) {
    log.error('Error updating video for show (%d): %s', showId, error.stack)
    submission.error.video = error.message
    return json(submission, { status: 500 })
  }

  const video = supabase.storage.from('videos').getPublicUrl(data.path)
  const url = video.data.publicUrl
  await prisma.show.update({
    where: { id: showId },
    data: {
      video: {
        connectOrCreate: {
          where: { url },
          create: { url, mimeType: submission.value.video.type },
        },
      },
    },
  })

  log.info('Updated video for show (%d): %s', showId, url)
  return json(submission)
}
