import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Form as RemixForm,
  Link,
  useActionData,
  useSearchParams,
} from '@remix-run/react'
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix'
import { json, redirect } from '@vercel/remix'
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

import { createUser, getUserByEmail } from 'models/user.server'

import { type Handle } from 'root'
import { createUserSession, getUserId } from 'session.server'
import { safeRedirect } from 'utils'
import { email as emailSchema, password as passwordSchema } from 'utils/schema'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .includes(' ', { message: 'Name must include both first and last' }),
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be fewer than 30 characters')
    .regex(
      /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
      'Username contains invalid characters',
    ),
  email: emailSchema,
  password: passwordSchema,
})

export const handle: Handle = {
  breadcrumb: () => <Link to='/join'>sign up</Link>,
}

export const config = { runtime: 'edge' }

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const existingUser = await getUserByEmail(submission.value.email)
  if (existingUser) {
    submission.error.email = 'A user already exists with this email'
    return json(submission, { status: 400 })
  }

  const user = await createUser(
    submission.value.name,
    submission.value.username,
    submission.value.email,
    submission.value.password,
  )

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  })
}

export const meta: V2_MetaFunction = () => [{ title: 'Register' }]

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const lastSubmission = useActionData<typeof action>()
  const [form, { name, username, email, password }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  return (
    <Form asChild className='max-w-sm w-full mx-auto mt-6 p-6'>
      <RemixForm method='post' {...form.props}>
        <header className='mb-2'>
          <h1 className='text-2xl font-medium'>Sign up</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Already have an account?{' '}
            <Link className='underline' to='/login'>
              Login here.
            </Link>
          </p>
        </header>
        <input type='hidden' name='redirectTo' value={redirectTo} />
        <FormField name={name.name}>
          <FormLabelWrapper>
            <FormLabel>Name</FormLabel>
            {name.error && <FormMessage>{name.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='John Doe' />
          </FormControl>
        </FormField>
        <FormField name={username.name}>
          <FormLabelWrapper>
            <FormLabel>Username</FormLabel>
            {username.error && <FormMessage>{username.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='john.doe' />
          </FormControl>
        </FormField>
        <FormField name={email.name}>
          <FormLabelWrapper>
            <FormLabel>Email</FormLabel>
            {email.error && <FormMessage>{email.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='john@doe.com' />
          </FormControl>
        </FormField>
        <FormField name={password.name}>
          <FormLabelWrapper>
            <FormLabel>Password</FormLabel>
            {password.error && <FormMessage>{password.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input type='password' placeholder='••••••••' />
          </FormControl>
        </FormField>
        <FormSubmit asChild>
          <Button>Create account</Button>
        </FormSubmit>
      </RemixForm>
    </Form>
  )
}
