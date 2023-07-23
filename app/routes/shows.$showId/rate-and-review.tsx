import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from '@remix-run/react'
import { type ActionArgs, json, redirect } from '@vercel/remix'
import { StarHalf } from 'lucide-react'
import * as React from 'react'
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
import { Textarea } from 'components/ui/textarea'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'
import { cn } from 'utils/cn'

import { Section } from './section'

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

export async function action({ request, params }: ActionArgs) {
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const formData = await request.formData()
  const submission = parse(formData, { schema })
  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })
  const userId = await getUserId(request)
  if (userId == null) return redirect(`/login?redirectTo=/shows/${showId}`)
  log.info('creating review... %o', submission.value)
  const review = await prisma.review.create({
    data: {
      score: submission.value.score / 5,
      content: submission.value.content,
      author: { connect: { id: userId } },
      show: { connect: { id: showId } },
    },
  })
  log.info('created review: %o', review)
  return redirect(`/shows/${showId}`)
}

const ScoreInput = React.forwardRef<
  React.ElementRef<typeof RadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Root>
>(({ className, ...props }, ref) => (
  <RadioGroup.Root
    className={cn(
      'flex items-center flex-row-reverse group justify-end relative w-min',
      className,
    )}
    {...props}
    orientation='horizontal'
    ref={ref}
  >
    {[5, 4, 3, 2, 1].map((value) => (
      <Star value={value} key={value} />
    ))}
  </RadioGroup.Root>
))
ScoreInput.displayName = RadioGroup.Root.displayName

function Star({ value }: { value: number }) {
  return (
    <>
      <StarSide right value={value.toString()} />
      <StarSide left value={(value - 0.5).toString()} />
    </>
  )
}

function StarSide({
  left,
  right,
  value,
}: {
  left?: boolean
  right?: boolean
  value: string
}) {
  return (
    <RadioGroup.Item
      className={cn(
        'overflow-hidden peer text-gray-300 dark:text-gray-600',
        'group-hover:aria-checked:text-gray-300 dark:group-hover:aria-checked:text-gray-600 group-hover:peer-aria-checked:text-gray-300 dark:group-hover:peer-aria-checked:text-gray-600',
        'aria-checked:text-gray-900 dark:aria-checked:text-gray-100 peer-aria-checked:text-gray-900 dark:peer-aria-checked:text-gray-100',
        'hover:!text-gray-900 dark:hover:!text-gray-100 peer-hover:!text-gray-900 dark:peer-hover:!text-gray-100',
        right && 'pr-0.5 first-of-type:pr-0',
        left && 'pl-0.5 last-of-type:pl-0',
      )}
      value={value}
    >
      <RadioGroup.Indicator />
      <StarHalf
        className={cn(
          'w-6 h-6',
          right && '-ml-3 -scale-x-100',
          left && '-mr-3',
        )}
      />
    </RadioGroup.Item>
  )
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
              <ScoreInput required />
            </FormControl>
          </FormField>
          <FormField name={content.name}>
            <FormLabelWrapper>
              <FormLabel>What did you think of the runway?</FormLabel>
              {content.error && <FormMessage>{content.error}</FormMessage>}
            </FormLabelWrapper>
            <FormControl asChild>
              <Textarea required />
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
