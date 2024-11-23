import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  Link,
  Form as RemixForm,
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
  const remember = formData.get('remember')
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success')
    return json(submission.reply(), { status: 400 })

  const user = await verifyLogin(
    submission.value.emailOrUsername,
    submission.value.password,
  )

  if (!user)
    return json(
      submission.reply({
        fieldErrors: { emailOrUsername: ['Incorrect email or password'] },
        hideFields: ['password'],
      }),
      { status: 400 },
    )

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on',
    redirectTo,
  })
}

export const meta: MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const lastResult = useActionData<typeof action>()
  const [form, { emailOrUsername, password }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })
  const navigation = useNavigation()
  return (
    <Form asChild className='max-w-sm w-full mx-auto mt-6 p-6'>
      <RemixForm method='post' {...getFormProps(form)}>
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
            {emailOrUsername.errors && (
              <FormMessage>{emailOrUsername.errors}</FormMessage>
            )}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='anna@vogue.com' required />
          </FormControl>
        </FormField>
        <FormField name={password.name}>
          <FormLabelWrapper>
            <FormLabel>Password</FormLabel>
            {password.errors && <FormMessage>{password.errors}</FormMessage>}
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
