import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Link,
  Form as RemixForm,
  useActionData,
  useSearchParams,
  useNavigation,
} from '@remix-run/react'
import {
  type ActionArgs,
  type LoaderArgs,
  type V2_MetaFunction,
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

import { verifyLogin } from 'models/user.server'

import { safeRedirect } from 'utils/general'
import {
  username as usernameSchema,
  email as emailSchema,
  password as passwordSchema,
} from 'utils/schema'

import { type Handle } from 'root'
import { createUserSession, getUserId } from 'session.server'

const schema = z.object({
  emailOrUsername: emailSchema.or(usernameSchema),
  password: passwordSchema,
})

export const handle: Handle = {
  breadcrumb: () => ({ to: '/login', children: 'login' }),
}

export const config = { runtime: 'nodejs' }

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const redirectTo = safeRedirect(url.searchParams.get('redirectTo'), '/')
  const userId = await getUserId(request)
  if (userId) return redirect(redirectTo)
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  const remember = formData.get('remember')
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const user = await verifyLogin(
    submission.value.emailOrUsername,
    submission.value.password,
  )

  if (!user) {
    submission.error.emailOrUsername = ['Incorrect email or password']
    return json(submission, { status: 400 })
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on',
    redirectTo,
  })
}

export const meta: V2_MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const lastSubmission = useActionData<typeof action>()
  const [form, { emailOrUsername, password }] = useForm({
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
          <h1 className='text-2xl font-medium'>Log in</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Don’t have an account?{' '}
            <Link
              prefetch='intent'
              className='underline'
              to={redirectTo ? `/join?redirectTo=${redirectTo}` : '/join'}
            >
              Sign up here.
            </Link>
          </p>
        </header>
        <input type='hidden' name='redirectTo' value={redirectTo} />
        <FormField name={emailOrUsername.name}>
          <FormLabelWrapper>
            <FormLabel>Email or username</FormLabel>
            {emailOrUsername.error && (
              <FormMessage>{emailOrUsername.error}</FormMessage>
            )}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='anna@vogue.com' required />
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
          <Button disabled={navigation.state !== 'idle'}>Log in</Button>
        </FormSubmit>
      </RemixForm>
    </Form>
  )
}
