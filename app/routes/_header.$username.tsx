import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Outlet,
  Link,
  NavLink,
  Form,
  type NavLinkProps,
  useLoaderData,
  useNavigation,
  useOutletContext,
  useActionData,
  useSubmit,
} from '@remix-run/react'
import {
  type DataFunctionArgs,
  type SerializeFrom,
  type MetaFunction,
  json,
} from '@vercel/remix'
import {
  Shirt,
  ShoppingCart,
  Bookmark,
  Folder,
  MessageCircle,
} from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import { type PropsWithChildren, useRef } from 'react'
import { type SitemapFunction } from 'remix-sitemap'
import { z } from 'zod'

import { Avatar, getFallback } from 'components/avatar'
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from 'components/ui/avatar'
import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { NAME, useOptionalUser, useRedirectTo } from 'utils/general'
import { OWN_SET_NAME, WANT_SET_NAME } from 'utils/set'

import { prisma, supabase } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

const schema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.name !== '' && file.size > 0, 'Avatar is required')
    .refine((file) => file.size < 5e6, 'Avatar cannot be larger than 5 MB'),
})

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) return [{ title: `404 | ${NAME}` }]
  let title = data.name
  if (data.username) title += ` (@${data.username})`
  title += ` | ${NAME}`
  return [{ title }]
}

export const sitemap: SitemapFunction = async () => {
  const users = await prisma.user.findMany({
    orderBy: { username: 'asc' },
    where: { username: { not: null } },
  })
  return users.map((user) => ({
    loc: `/${user.username as string}`,
    lastmod: user.updatedAt.toISOString(),
  }))
}

export async function loader({ params }: DataFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const [user, lookCount] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      include: {
        sets: { where: { name: { in: [WANT_SET_NAME, OWN_SET_NAME] } } },
        _count: { select: { reviews: true, sets: true } },
      },
    }),
    prisma.look.count({
      where: { sets: { some: { author: { username: params.username } } } },
    }),
  ])
  if (user == null) throw new Response('Not Found', { status: 404 })
  return { ...user, lookCount }
}

export async function action({ request, params }: DataFunctionArgs) {
  log.info('Updating avatar for @%s...', params.username)
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  if (userId == null) throw new Response('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  })
  if (user == null) throw new Response('Not Found', { status: 404 })
  if (user.id !== userId) throw new Response('Forbidden', { status: 403 })

  const formData = await request.formData()
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`users/${user.id}/${nanoid()}`, submission.value.avatar)

  if (error) {
    log.error('Error updating avatar for @%s: %s', params.username, error.stack)
    submission.error.avatar = ['Failed to upload avatar; try again later']
    return json(submission, { status: 500 })
  }

  const avatar = supabase.storage.from('avatars').getPublicUrl(data.path)
  await prisma.user.update({
    where: { id: user.id },
    data: { avatar: avatar.data.publicUrl },
  })

  log.info('Updated avatar for @%s: %s', params.username, avatar.data.publicUrl)
  return json(submission)
}

export const useUser = () => useOutletContext<SerializeFrom<typeof loader>>()

export default function UserPage() {
  const { sets } = useLoaderData<typeof loader>()
  const want = sets.find((set) => set.name === WANT_SET_NAME)
  const own = sets.find((set) => set.name === OWN_SET_NAME)
  return (
    <main className='grid max-w-screen-xl mx-auto p-6'>
      <Header />
      <Tabs>
        <Tab to='.' end>
          <Bookmark className='w-3 h-3' />
          Saved
        </Tab>
        {want && (
          <Tab to={`sets/${want.id}`}>
            <ShoppingCart className='w-3 h-3' />
            {WANT_SET_NAME}
          </Tab>
        )}
        {own && (
          <Tab to={`sets/${own.id}`}>
            <Shirt className='w-3 h-3' />
            {OWN_SET_NAME}
          </Tab>
        )}
        <Tab to='sets'>
          <Folder className='w-3 h-3' />
          Sets
        </Tab>
        <Tab to='reviews'>
          <MessageCircle className='w-3 h-3' />
          Reviews
        </Tab>
      </Tabs>
      <Outlet context={useLoaderData<typeof loader>()} />
    </main>
  )
}

function Tabs({ children }: PropsWithChildren) {
  return (
    <nav className='border-t border-gray-200 dark:border-gray-800 flex justify-center gap-14'>
      {children}
    </nav>
  )
}

function Tab({ className, prefetch, ...etc }: NavLinkProps) {
  return (
    <NavLink
      prefetch={prefetch ?? 'intent'}
      className={({ isActive }) =>
        cn(
          'h-14 flex items-center justify-center gap-1.5 -mt-px border-t uppercase transition-colors text-2xs font-semibold',
          isActive
            ? 'border-gray-900 dark:border-gray-100'
            : 'border-transparent text-gray-500 dark:text-gray-400',
          className,
        )
      }
      {...etc}
    />
  )
}

function Header() {
  const user = useLoaderData<typeof loader>()
  const currentUser = useOptionalUser()
  const redirectTo = useRedirectTo()
  return (
    <header className='flex items-center gap-2 mb-11'>
      <div className='grow flex items-center justify-center'>
        {currentUser?.id === user.id ? (
          <AvatarForm />
        ) : (
          <Avatar src={user} className='w-36 h-36 text-3xl' />
        )}
      </div>
      <div className='grow-[2] grid gap-5'>
        <div className='flex items-center gap-2'>
          <h2 className='text-xl mr-5'>{user.username}</h2>
          {currentUser?.id === user.id && (
            <Link
              to='/profile'
              prefetch='intent'
              className={buttonVariants({ variant: 'secondary' })}
            >
              Edit profile
            </Link>
          )}
          {currentUser == null && (
            <>
              <Link
                to={`/join?redirectTo=${redirectTo}`}
                prefetch='intent'
                className={buttonVariants({ variant: 'secondary' })}
              >
                Follow
              </Link>
              <Link
                to={`/join?redirectTo=${redirectTo}`}
                prefetch='intent'
                className={buttonVariants({ variant: 'secondary' })}
              >
                Message
              </Link>
            </>
          )}
        </div>
        <div className='flex items-center gap-10 font-semibold text-sm'>
          <Link to='.'>{user.lookCount} saved</Link>
          <Link to='sets'>{user._count.sets} sets</Link>
          <Link to='reviews'>{user._count.reviews} reviews</Link>
        </div>
        <article className='text-sm max-w-xl'>
          <h3 className='font-semibold'>{user.name}</h3>
          {user.description != null && <p>{user.description}</p>}
        </article>
      </div>
    </header>
  )
}

function AvatarForm() {
  const lastSubmission = useActionData<typeof action>()
  const [form, { avatar }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  const user = useLoaderData<typeof loader>()
  const submit = useSubmit()
  const navigation = useNavigation()
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Form
      method='post'
      encType='multipart/form-data'
      onChange={(event) => submit(event.currentTarget)}
      {...form.props}
    >
      <AvatarRoot className='w-36 h-36'>
        {navigation.state !== 'idle' && navigation.formData ? (
          <>
            <AvatarImage />
            <AvatarFallback className='animate-pulse' />
          </>
        ) : avatar.error ? (
          <>
            <AvatarImage />
            <AvatarFallback className='text-center p-4 text-2xs'>
              {avatar.error}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
            {lastSubmission ? (
              <AvatarFallback className='animate-pulse' />
            ) : (
              <AvatarFallback className='text-3xl'>
                {getFallback(user)}
              </AvatarFallback>
            )}
          </>
        )}
        <button
          type='button'
          aria-label='Edit avatar'
          className='absolute inset-0 w-full h-full'
          disabled={navigation.state !== 'idle'}
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          name={avatar.name}
          className='hidden'
          accept='image/*'
          type='file'
          required
        />
      </AvatarRoot>
    </Form>
  )
}
