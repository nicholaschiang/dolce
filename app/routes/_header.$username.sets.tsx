import { NavLink, Outlet, useLoaderData, useNavigation } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { FolderClosed, FolderOpen } from 'lucide-react'

import { buttonVariants } from 'components/ui/button'

import { prisma } from 'db.server'
import { cn } from 'utils/cn'

export async function loader({ params }: LoaderArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const sets = await prisma.set.findMany({
    where: { author: { username: params.username } },
    orderBy: { updatedAt: 'desc' },
  })
  return sets
}

export default function UserSetsPage() {
  const sets = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  return (
    <div className='flex gap-6'>
      <ol className='flex-none w-48 h-min sticky top-14'>
        {sets.map((set) => (
          <li key={set.id}>
            <NavLink
              to={set.id.toString()}
              prefetch='intent'
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
                    : 'text-gray-500 dark:text-gray-400',
                  navigation.state === 'loading' && 'cursor-wait',
                  'flex justify-start gap-2',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <FolderOpen className='flex-none w-3 h-3' />
                  ) : (
                    <FolderClosed className='flex-none w-3 h-3' />
                  )}
                  <span className='truncate'>{set.name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ol>
      <div className='flex-1 h-min'>
        <Outlet />
      </div>
    </div>
  )
}
