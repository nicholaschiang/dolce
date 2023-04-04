import * as React from 'react'
import type { ActionArgs, LoaderArgs, MetaFunction } from '@vercel/remix'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@vercel/remix'

import { createUser, getUserByEmail } from 'models/user.server'

import { createUserSession, getUserId } from 'session.server'
import { safeRedirect, validateEmail, validateUsername } from 'utils'

export const config = { runtime: 'edge' }

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const name = formData.get('name')
  const username = formData.get('username')
  const email = formData.get('email')
  const password = formData.get('password')
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

  if (typeof name !== 'string' || name.length === 0) {
    return json(
      {
        errors: {
          name: 'Name is invalid',
          username: null,
          email: null,
          password: null,
        },
      },
      { status: 400 },
    )
  }

  if (!validateUsername(username)) {
    return json(
      {
        errors: {
          name: null,
          username: 'Username is invalid',
          email: null,
          password: null,
        },
      },
      { status: 400 },
    )
  }

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          name: null,
          username: null,
          email: 'Email is invalid',
          password: null,
        },
      },
      { status: 400 },
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      {
        errors: {
          name: null,
          username: null,
          email: null,
          password: 'Password is required',
        },
      },
      { status: 400 },
    )
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          name: null,
          username: null,
          email: null,
          password: 'Password is too short',
        },
      },
      { status: 400 },
    )
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return json(
      {
        errors: {
          name: null,
          username: null,
          email: 'A user already exists with this email',
          password: null,
        },
      },
      { status: 400 },
    )
  }

  const user = await createUser(name, username, email, password)

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up',
  }
}

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const actionData = useActionData<typeof action>()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus()
    } else if (actionData?.errors?.username) {
      usernameRef.current?.focus()
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className='flex min-h-full flex-col justify-center'>
      <div className='mx-auto w-full max-w-md px-8'>
        <Form method='post' className='space-y-6' noValidate>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <div className='mt-1'>
              <input
                ref={nameRef}
                id='name'
                required
                name='name'
                autoComplete='name'
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-describedby='name-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.name && (
                <div className='pt-1 text-red-700' id='name-error'>
                  {actionData.errors.name}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <div className='mt-1'>
              <input
                ref={usernameRef}
                id='username'
                required
                name='username'
                aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby='username-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.username && (
                <div className='pt-1 text-red-700' id='username-error'>
                  {actionData.errors.username}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <div className='mt-1'>
              <input
                ref={emailRef}
                id='email'
                required
                name='email'
                type='email'
                autoComplete='email'
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby='email-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.email && (
                <div className='pt-1 text-red-700' id='email-error'>
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                id='password'
                ref={passwordRef}
                name='password'
                type='password'
                autoComplete='new-password'
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby='password-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.password && (
                <div className='pt-1 text-red-700' id='password-error'>
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type='hidden' name='redirectTo' value={redirectTo} />
          <button
            type='submit'
            className='w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
          >
            Create Account
          </button>
          <div className='flex items-center justify-center'>
            <div className='text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link
                className='text-blue-500 underline'
                to={{
                  pathname: '/login',
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
