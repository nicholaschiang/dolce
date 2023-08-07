import {
  Outlet,
  Link,
  NavLink,
  type NavLinkProps,
  useLoaderData,
  useLocation,
  useOutletContext,
} from '@remix-run/react'
import { type LoaderArgs, type SerializeFrom } from '@vercel/remix'
import { Bookmark, MessageCircle } from 'lucide-react'
import { type PropsWithChildren } from 'react'

import { Avatar } from 'components/avatar'
import { buttonVariants } from 'components/ui/button'

import { prisma } from 'db.server'
import { useOptionalUser } from 'utils'
import { cn } from 'utils/cn'

export async function loader({ params }: LoaderArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const [user, lookCount] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      include: { _count: { select: { reviews: true } } },
    }),
    prisma.look.count({
      where: { sets: { some: { author: { username: params.username } } } },
    }),
  ])
  if (user == null) throw new Response('Not Found', { status: 404 })
  return { ...user, lookCount }
}

export const useUser = () => useOutletContext<SerializeFrom<typeof loader>>()

export default function UserPage() {
  return (
    <main className='grid max-w-screen-lg mx-auto p-6'>
      <Header />
      <Tabs>
        <Tab to='.' end>
          <Bookmark className='w-3 h-3' />
          Saved
        </Tab>
        <Tab to='reviews' end>
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
    <nav className='border-t border-gray-200 dark:border-gray-700 flex justify-center gap-14'>
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
  const location = useLocation()
  return (
    <header className='flex items-center gap-2 mb-11'>
      <div className='grow flex items-center justify-center'>
        <Avatar src={user} className='w-36 h-36 text-3xl' />
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
                to={`/join?redirectTo=${location.pathname}`}
                prefetch='intent'
                className={buttonVariants({ variant: 'secondary' })}
              >
                Follow
              </Link>
              <Link
                to={`/join?redirectTo=${location.pathname}`}
                prefetch='intent'
                className={buttonVariants({ variant: 'secondary' })}
              >
                Message
              </Link>
            </>
          )}
        </div>
        <div className='flex items-center gap-10 font-semibold text-sm'>
          <span>{user._count.reviews} reviews</span>
          <span>{user.lookCount} saved</span>
        </div>
        <article className='text-sm max-w-xl'>
          <h3 className='font-semibold'>{user.name}</h3>
          {user.description != null && <p>{user.description}</p>}
        </article>
      </div>
    </header>
  )
}
