import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Link,
  Form as RemixForm,
  useActionData,
  useNavigation,
  useLoaderData,
} from '@remix-run/react'
import { type ActionArgs, json, redirect } from '@vercel/remix'
import { useId } from 'react'
import { z } from 'zod'

import {
  Form,
  FormField,
  FormLabel,
  FormLabelWrapper,
  FormControl,
  FormSubmit,
  FormMessage,
} from 'components/form'
import { ScoreInput } from 'components/score-input'
import { Button } from 'components/ui/button'
import { Textarea } from 'components/ui/textarea'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'
import { invert, useOptionalUser, useRedirectTo } from 'utils'
import { SEASON_NAME_TO_SLUG } from 'utils/season'
import { SEX_TO_SLUG } from 'utils/sex'
import { getShowPath } from 'utils/show'

import { type loader } from './route'
import { Section } from './section'

const id = 'rate-and-review'
const schema = z.object({
  score: z.preprocess(
    (score) => Number(score),
    z
      .number({
        invalid_type_error: 'Please select a score',
        required_error: 'Please select a score',
      })
      .max(5, 'Score cannot be larger than 5')
      .min(0.5, 'Score cannot be less than 0.5'),
  ),
  content: z.string().trim().min(1, 'Required').min(10, 'Too short'),
})

export async function getReview(showId: number, request: Request) {
  const userId = await getUserId(request)
  return userId
    ? prisma.review.findUnique({
        where: { authorId_showId: { showId, authorId: userId } },
      })
    : undefined
}

export async function action({ request, params }: ActionArgs) {
  const seasonYear = Number(params.seasonYear)
  const miss = new Response(null, { status: 404, statusText: 'Not Found' })
  if (Number.isNaN(seasonYear) || !params.seasonName || !params.brandSlug)
    throw miss
  const seasonName = invert(SEASON_NAME_TO_SLUG)[params.seasonName]
  const sex = invert(SEX_TO_SLUG)[params.sex ?? '']
  if (!sex || !seasonName) throw miss
  const show = await prisma.show.findFirst({
    where: {
      brand: { slug: params.brandSlug },
      season: { year: seasonYear, name: seasonName },
      sex,
    },
    include: { season: true, brand: true },
  })
  if (show == null) throw miss
  const userId = await getUserId(request)
  if (userId == null)
    return redirect(`/login?redirectTo=${getShowPath(show)}%23${id}`)
  const formData = await request.formData()
  const submission = parse(formData, { schema })
  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })
  log.info('creating review... %o', submission.value)
  const review = await prisma.review.upsert({
    where: { authorId_showId: { showId: show.id, authorId: userId } },
    update: {
      score: submission.value.score / 5,
      content: submission.value.content,
    },
    create: {
      score: submission.value.score / 5,
      content: submission.value.content,
      author: { connect: { id: userId } },
      show: { connect: { id: show.id } },
    },
  })
  log.info('created review: %o', review)
  return redirect('.')
}

export function RateAndReview() {
  const user = useOptionalUser()
  const lastSubmission = useActionData<typeof action>()
  const [form, { score, content }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  const navigation = useNavigation()
  const { review } = useLoaderData<typeof loader>()
  const labelId = useId()
  const redirectTo = useRedirectTo({ hash: `#${id}` })
  return (
    <Section header='Rate and review' id={id}>
      <Form asChild>
        <RemixForm
          method='post'
          className='max-w-sm mt-2 shadow-sm border border-gray-200 dark:border-gray-800 rounded-md p-4 relative'
          {...form.props}
        >
          {user == null && (
            <Link
              prefetch='intent'
              to={`/login?redirectTo=${redirectTo}`}
              className='absolute inset-0 z-10'
            />
          )}
          <FormField name={score.name}>
            <FormLabelWrapper>
              <FormLabel id={labelId}>Review score</FormLabel>
              {score.error && <FormMessage>{score.error}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <ScoreInput
                aria-labelledby={labelId}
                required
                defaultValue={
                  review ? `${Number(review.score) * 5}` : undefined
                }
              />
            </FormControl>
          </FormField>
          <FormField name={content.name}>
            <FormLabelWrapper>
              <FormLabel>What did you think of the runway?</FormLabel>
              {content.error && <FormMessage>{content.error}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <Textarea required defaultValue={review?.content} />
            </FormControl>
          </FormField>
          <FormSubmit asChild>
            <Button disabled={navigation.formAction != null}>
              {review ? 'Edit review' : 'Submit review'}
            </Button>
          </FormSubmit>
        </RemixForm>
      </Form>
    </Section>
  )
}
