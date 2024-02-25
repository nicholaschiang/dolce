import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from '@remix-run/react'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from '@vercel/remix'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { ConsumerReview } from 'components/consumer-review'
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

import { updateUser } from 'models/user.server'

import { NAME, useUser } from 'utils/general'
import {
  name as nameSchema,
  username as usernameSchema,
  email as emailSchema,
  password as passwordSchema,
} from 'utils/schema'

import { prisma } from 'db.server'
import { type Handle } from 'root'
import { requireUserId } from 'session.server'

const schema = z.object({
  name: nameSchema,
  username: usernameSchema,
  description: z.string().min(0).max(150).optional(),
  email: emailSchema,
  password: passwordSchema.optional(),
})

export const handle: Handle = {
  breadcrumb: () => ({ to: '/profile', children: 'profile' }),
}

export const config = { runtime: 'nodejs' }

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request, '/profile')
  return json({ userId })
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request, '/profile')

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success')
    return json(submission.reply(), { status: 400 })

  let existingUser = await prisma.user.findFirst({
    where: { name: submission.value.name, id: { not: userId } },
  })
  if (existingUser)
    return json(
      submission.reply({
        fieldErrors: { name: ['A user already exists with this name'] },
      }),
      { status: 400 },
    )

  existingUser = await prisma.user.findFirst({
    where: { username: submission.value.username, id: { not: userId } },
  })
  if (existingUser)
    return json(
      submission.reply({
        fieldErrors: { username: ['A user already exists with this username'] },
      }),
      { status: 400 },
    )

  existingUser = await prisma.user.findFirst({
    where: { email: submission.value.email, id: { not: userId } },
  })
  if (existingUser)
    return json(
      submission.reply({
        fieldErrors: { email: ['A user already exists with this email'] },
      }),
      { status: 400 },
    )

  await updateUser(
    userId,
    submission.value.name,
    submission.value.username,
    submission.value.description ?? null,
    submission.value.email,
    submission.value.password,
  )

  return json(submission)
}

export const meta: MetaFunction = () => [{ title: `Edit Profile | ${NAME}` }]

export default function ProfilePage() {
  const user = useUser()
  const navigation = useNavigation()
  const lastResult = useActionData<typeof action>()
  const [form, { name, username, description, email, password }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })
  const [state, setState] = useState(user)
  useEffect(() => setState(user), [user])
  return (
    <div className='flex h-full flex-1 items-center justify-center overflow-hidden'>
      <header className='flex-1 px-6 border-r border-gray-200 dark:border-gray-800 h-full flex items-center justify-end bg-gray-50 dark:bg-gray-900'>
        <div className='border border-gray-200 dark:border-gray-800 shadow-sm rounded-md p-4 bg-white dark:bg-gray-950 max-w-sm'>
          <ConsumerReview
            author={state}
            content='Your profile is looking fantastic—the fashion is a bit lacking though... glad you’re here! 😮‍💨'
            updatedAt={user.updatedAt}
          />
        </div>
      </header>
      <div className='max-h-full flex-1 overflow-auto py-12 px-6'>
        <Form asChild className='max-w-sm w-full mr-auto'>
          <RemixForm method='patch' {...getFormProps(form)}>
            <FormField name={name.name}>
              <FormLabelWrapper>
                <FormLabel>Name</FormLabel>
                {name.errors && <FormMessage>{name.errors}</FormMessage>}
              </FormLabelWrapper>
              <FormControl asChild>
                <Input
                  placeholder='Anna Wintour'
                  value={state.name}
                  onChange={(e) => {
                    const next = e.currentTarget.value
                    setState((p) => ({ ...p, name: next }))
                  }}
                  required
                />
              </FormControl>
            </FormField>
            <FormField name={username.name}>
              <FormLabelWrapper>
                <FormLabel>Username</FormLabel>
                {username.errors && (
                  <FormMessage>{username.errors}</FormMessage>
                )}
              </FormLabelWrapper>
              <FormControl asChild>
                <Input
                  placeholder='anna.wintour'
                  autoComplete='off'
                  value={state.username ?? ''}
                  onChange={(e) => {
                    const next = e.currentTarget.value
                    setState((p) => ({ ...p, username: next }))
                  }}
                  required
                />
              </FormControl>
            </FormField>
            <FormField name={description.name}>
              <FormLabelWrapper>
                <FormLabel>Bio</FormLabel>
                {description.errors && (
                  <FormMessage>{description.errors}</FormMessage>
                )}
              </FormLabelWrapper>
              <FormControl asChild>
                <Textarea
                  autoComplete='off'
                  value={state.description ?? ''}
                  onChange={(e) => {
                    const next = e.currentTarget.value
                    setState((p) => ({ ...p, description: next }))
                  }}
                />
              </FormControl>
            </FormField>
            <FormField name={email.name}>
              <FormLabelWrapper>
                <FormLabel>Email</FormLabel>
                {email.errors && <FormMessage>{email.errors}</FormMessage>}
              </FormLabelWrapper>
              <FormControl asChild>
                <Input
                  type='email'
                  placeholder='anna@vogue.com'
                  value={state.email ?? ''}
                  onChange={(event) => {
                    const next = event.currentTarget.value
                    setState((p) => ({ ...p, email: next }))
                  }}
                  required
                />
              </FormControl>
            </FormField>
            <FormField name={password.name}>
              <FormLabelWrapper>
                <FormLabel>Edit password</FormLabel>
                {password.errors && (
                  <FormMessage>{password.errors}</FormMessage>
                )}
              </FormLabelWrapper>
              <FormControl asChild>
                <Input
                  autoComplete='new-password'
                  type='password'
                  placeholder='••••••••'
                />
              </FormControl>
            </FormField>
            <FormSubmit asChild>
              <Button disabled={navigation.formAction != null}>
                Update profile
              </Button>
            </FormSubmit>
          </RemixForm>
        </Form>
      </div>
    </div>
  )
}
