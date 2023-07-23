import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from '@remix-run/react'
import { type ActionArgs, json, redirect } from '@vercel/remix'
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
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

import { Section } from './section'

const schema = z.object({
  score: z.preprocess(
    (score) => Number(score),
    z
      .number()
      .lte(1, 'Score cannot be larger than 1.0')
      .gte(0, 'Score cannot be negative'),
  ),
  content: z.string().trim().min(1, 'Required').min(10, 'Too short'),
})

export async function action({ request, params }: ActionArgs) {
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const formData = await request.formData()
  const submission = parse(formData, { schema })
  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })
  const userId = await getUserId(request)
  if (userId == null)
    return redirect(`/login?redirectTo=/shows/${showId}#rate-and-review`)
  log.info('creating review... %o', submission.value)
  const review = await prisma.review.create({
    data: {
      score: submission.value.score,
      content: submission.value.content,
      author: { connect: { id: userId } },
      show: { connect: { id: showId } },
    },
  })
  log.info('created review: %o', review)
  return redirect(`/shows/${showId}`)
}

export function RateAndReview() {
  const lastSubmission = useActionData<typeof action>()
  const [form, { score, content }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  const navigation = useNavigation()
  return (
    <Section header='Rate and review' id='rate-and-review'>
      <Form
        asChild
        className='max-w-sm mt-2 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md p-4'
      >
        <RemixForm method='post' {...form.props}>
          <FormField name={score.name}>
            <FormLabelWrapper>
              <FormLabel>Review score</FormLabel>
              {score.error && <FormMessage>{score.error}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <Input type='number' max={1} min={0} />
            </FormControl>
          </FormField>
          <FormField name={content.name}>
            <FormLabelWrapper>
              <FormLabel>What did you think of the runway?</FormLabel>
              {content.error && <FormMessage>{content.error}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <Textarea />
            </FormControl>
          </FormField>
          <FormSubmit asChild>
            <Button disabled={navigation.state !== 'idle'}>Submit</Button>
          </FormSubmit>
        </RemixForm>
      </Form>
    </Section>
  )
}
