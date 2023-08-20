import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { useId } from 'react'
import { z } from 'zod'

import { type action as reviewAPI } from 'routes/api.shows.$showId.review'

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

import { useOptionalUser, useRedirectTo } from 'utils/general'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

import { type loader } from './route'
import { Section } from './section'

export const id = 'review'
export const schema = z.object({
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

export function RateAndReview() {
  const user = useOptionalUser()
  const fetcher = useFetcher<typeof reviewAPI>()
  const [form, { score, content }] = useForm({
    lastSubmission: fetcher.data,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  const show = useLoaderData<typeof loader>()
  const redirectTo = useRedirectTo({ hash: `#${id}` })
  const labelId = useId()
  return (
    <Section header='Your Review' id={id}>
      <Form className='gap-3' asChild>
        <fetcher.Form
          method={show.review ? 'put' : 'post'}
          action={`/api/shows/${show.id}/review`}
          className='max-w-sm mt-2 shadow-sm border border-gray-200 dark:border-gray-800 rounded p-3 relative bg-gray-50 dark:bg-gray-900'
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
                  show.review ? `${Number(show.review.score) * 5}` : undefined
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
              <Textarea required defaultValue={show.review?.content} />
            </FormControl>
          </FormField>
          <FormSubmit asChild>
            <Button disabled={fetcher.state !== 'idle'}>
              {show.review ? 'Edit review' : 'Submit review'}
            </Button>
          </FormSubmit>
        </fetcher.Form>
      </Form>
    </Section>
  )
}
