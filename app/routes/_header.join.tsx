import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Form as RemixForm,
  Link,
  useActionData,
  useSearchParams,
  useNavigation,
} from '@remix-run/react'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  redirect,
} from '@vercel/remix'
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

import {
  createUser,
  getUserByName,
  getUserByUsername,
  getUserByEmail,
} from 'models/user.server'

import { safeRedirect } from 'utils/general'
import {
  name as nameSchema,
  username as usernameSchema,
  email as emailSchema,
  password as passwordSchema,
} from 'utils/schema'

import { type Handle } from 'root'
import { createUserSession, getUserId } from 'session.server'

const schema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const handle: Handle = {
  breadcrumb: () => ({ to: '/join', children: 'sign up' }),
}

export const config = { runtime: 'nodejs' }

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const redirectTo = safeRedirect(url.searchParams.get('redirectTo'), '/')
  const userId = await getUserId(request)
  if (userId) return redirect(redirectTo)
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  let existingUser = await getUserByName(submission.value.name)
  if (existingUser) {
    submission.error.name = ['A user already exists with this name']
    return json(submission, { status: 400 })
  }

  existingUser = await getUserByUsername(submission.value.username)
  if (existingUser) {
    submission.error.username = ['A user already exists with this username']
    return json(submission, { status: 400 })
  }

  existingUser = await getUserByEmail(submission.value.email)
  if (existingUser) {
    submission.error.email = ['A user already exists with this email']
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

export const meta: MetaFunction = () => [{ title: 'Register' }]

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
  const navigation = useNavigation()
  return (
    <Form asChild className='max-w-sm w-full mx-auto mt-6 p-6'>
      <RemixForm method='post' {...form.props}>
        <header className='mb-2'>
          <h1 className='text-2xl font-medium'>Sign up</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              prefetch='intent'
              className='underline'
              to={redirectTo ? `/login?redirectTo=${redirectTo}` : '/login'}
            >
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
            <Input placeholder='Anna Wintour' required />
          </FormControl>
        </FormField>
        <FormField name={username.name}>
          <FormLabelWrapper>
            <FormLabel>Username</FormLabel>
            {username.error && <FormMessage>{username.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='anna.wintour' required />
          </FormControl>
        </FormField>
        <FormField name={email.name}>
          <FormLabelWrapper>
            <FormLabel>Email</FormLabel>
            {email.error && <FormMessage>{email.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input type='email' placeholder='anna@vogue.com' required />
          </FormControl>
        </FormField>
        <FormField name={password.name}>
          <FormLabelWrapper>
            <FormLabel>Password</FormLabel>
            {password.error && <FormMessage>{password.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input type='password' placeholder='••••••••' required />
          </FormControl>
        </FormField>
        <FormSubmit asChild>
          <Button disabled={navigation.state !== 'idle'}>Create account</Button>
        </FormSubmit>
      </RemixForm>
    </Form>
  )
}
