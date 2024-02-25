import { parseWithZod } from '@conform-to/zod'
import { type ActionFunctionArgs, json, redirect } from '@vercel/remix'

import {
  id,
  schema,
} from 'routes/_wardrobe.shows.($location).$year.$season.$sex.$level.$brand/rate-and-review'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function action({ request, params }: ActionFunctionArgs) {
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null)
    return redirect(`/login?redirectTo=/shows/${showId}%23${id}`)
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success')
    return json(submission.reply(), { status: 400 })
  log.info('creating review... %o', submission.value)
  const review = await prisma.review.upsert({
    where: { authorId_showId: { showId, authorId: userId } },
    update: {
      score: submission.value.score / 5,
      content: submission.value.content,
    },
    create: {
      score: submission.value.score / 5,
      content: submission.value.content,
      author: { connect: { id: userId } },
      show: { connect: { id: showId } },
    },
  })
  log.info('created review: %o', review)
  return json(submission.reply(), { status: 200 })
}
