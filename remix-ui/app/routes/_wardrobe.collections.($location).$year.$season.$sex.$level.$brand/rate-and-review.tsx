import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { useId } from 'react'
import { z } from 'zod'

import { type action as reviewAPI } from 'routes/api.collections.$collectionId.review'

import {
  Form,
  FormField,
  FormLabel,
  FormLabelWrapper,
  FormControl,
  FormSubmit,
  FormMessage,
} from 'components/form'
import { LayoutSection } from 'components/layout'
import { ScoreInput } from 'components/score-input'
import { Button } from 'components/ui/button'
import { Textarea } from 'components/ui/textarea'

import { useOptionalUser, useRedirectTo } from 'utils/general'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

import { type loader } from './route'

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

export async function getReview(collectionId: number, request: Request) {
  const userId = await getUserId(request)
  return userId
    ? prisma.review.findUnique({
        where: { authorId_collectionId: { collectionId, authorId: userId } },
      })
    : undefined
}

export function RateAndReview() {
  const user = useOptionalUser()
  const fetcher = useFetcher<typeof reviewAPI>()
  const [form, { score, content }] = useForm({
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })
  const collection = useLoaderData<typeof loader>()
  const redirectTo = useRedirectTo({ hash: `#${id}` })
  const labelId = useId()
  return (
    <LayoutSection header='Your Review' id={id}>
      <Form asChild>
        <fetcher.Form
          method={collection.review ? 'put' : 'post'}
          action={`/api/collections/${collection.id}/review`}
          className='max-w-sm mt-2 shadow-sm border border-gray-200 dark:border-gray-800 rounded p-4 relative'
          {...getFormProps(form)}
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
              {score.errors && <FormMessage>{score.errors}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <ScoreInput
                aria-labelledby={labelId}
                required
                defaultValue={
                  collection.review
                    ? `${Number(collection.review.score) * 5}`
                    : undefined
                }
              />
            </FormControl>
          </FormField>
          <FormField name={content.name}>
            <FormLabelWrapper>
              <FormLabel>What did you think of the runway?</FormLabel>
              {content.errors && <FormMessage>{content.errors}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <Textarea required defaultValue={collection.review?.content} />
            </FormControl>
          </FormField>
          <FormSubmit asChild>
            <Button disabled={fetcher.state !== 'idle'}>
              {collection.review ? 'Edit review' : 'Submit review'}
            </Button>
          </FormSubmit>
        </fetcher.Form>
      </Form>
    </LayoutSection>
  )
}
