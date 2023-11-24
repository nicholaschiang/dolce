import {
  type NavLinkProps,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'
import { Shirt, ShoppingCart, FolderClosed, FolderOpen } from 'lucide-react'

import { buttonVariants } from 'components/ui/button'
import { Separator } from 'components/ui/separator'

import { cn } from 'utils/cn'
import { OWN_SET_NAME, WANT_SET_NAME } from 'utils/set'

import { prisma } from 'db.server'

export async function loader({ params }: DataFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const sets = await prisma.set.findMany({
    where: { author: { username: params.username } },
    orderBy: { updatedAt: 'desc' },
  })
  return sets
}

export default function UserSetsPage() {
  const sets = useLoaderData<typeof loader>()
  const want = sets.find((set) => set.name === WANT_SET_NAME)
  const own = sets.find((set) => set.name === OWN_SET_NAME)
  return (
    <div className='flex gap-6'>
      <ol className='flex-none w-48 h-min sticky top-14'>
        {want && (
          <SetLink to={want.id.toString()}>
            <ShoppingCart className='w-3 h-3' />
            {WANT_SET_NAME}
          </SetLink>
        )}
        {own && (
          <SetLink to={own.id.toString()}>
            <Shirt className='w-3 h-3' />
            {OWN_SET_NAME}
          </SetLink>
        )}
        {(want != null || own != null) && <Separator className='m-2 w-auto' />}
        {sets
          .filter((set) => set !== want && set !== own)
          .map((set) => (
            <SetLink key={set.id} to={set.id.toString()}>
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
            </SetLink>
          ))}
      </ol>
      <div className='flex-1 h-min'>
        <Outlet />
      </div>
    </div>
  )
}

function SetLink({ className, ...etc }: NavLinkProps) {
  const navigation = useNavigation()
  return (
    <li>
      <NavLink
        prefetch='intent'
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: 'ghost' }),
            isActive
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50'
              : 'text-gray-500 dark:text-gray-400',
            navigation.state === 'loading' && 'cursor-wait',
            'flex justify-start gap-2',
            className,
          )
        }
        {...etc}
      />
    </li>
  )
}
