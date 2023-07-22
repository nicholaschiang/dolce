import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { Link, Form as RemixForm, useActionData } from '@remix-run/react'
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

import { verifyLogin } from 'models/user.server'

import { type Handle } from 'root'
import { createUserSession, getUserId } from 'session.server'
import { safeRedirect } from 'utils'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Email is invalid'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password is too short'),
})

export const handle: Handle = {
  breadcrumb: () => <Link to='/login'>login</Link>,
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
  const remember = formData.get('remember')
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const user = await verifyLogin(
    submission.value.email,
    submission.value.password,
  )

  if (!user) {
    submission.error.email = 'Incorrect email or password'
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
  const lastSubmission = useActionData<typeof action>()
  const [form, { email, password }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  return (
    <Form asChild className='max-w-sm w-full m-auto p-6'>
      <RemixForm method='post' {...form.props}>
        <h1 className='text-center text-2xl font-medium'>Login</h1>
        <FormField name={email.name}>
          <FormLabelWrapper>
            <FormLabel>Email</FormLabel>
            {email.error && <FormMessage>{email.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input placeholder='Your email address' />
          </FormControl>
        </FormField>
        <FormField name={password.name}>
          <FormLabelWrapper>
            <FormLabel>Password</FormLabel>
            {password.error && <FormMessage>{password.error}</FormMessage>}
          </FormLabelWrapper>
          <FormControl asChild>
            <Input type='password' placeholder='Your password' />
          </FormControl>
        </FormField>
        <FormSubmit asChild>
          <Button>Login</Button>
        </FormSubmit>
      </RemixForm>
    </Form>
  )
}
