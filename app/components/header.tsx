import {
  Link,
  type LinkProps,
  useFetcher,
  useMatches,
  useNavigation,
} from '@remix-run/react'
import { Settings, User, LogIn, LogOut, ChevronRight } from 'lucide-react'
import { type PropsWithChildren, Fragment } from 'react'

import { type action as logoutAPI } from 'routes/api.logout'

import { LoadingLine } from 'components/loading-line'
import { ThemeSwitcher } from 'components/theme-switcher'
import { Button, buttonVariants } from 'components/ui/button'

import { type Handle } from 'root'
import { useOptionalUser, useRedirectTo } from 'utils'
import { cn } from 'utils/cn'

export function Header({ className }: { className?: string }) {
  return (
    <HeaderWrapper className={className}>
      <HeaderBreadcrumbs />
      <HeaderActions />
    </HeaderWrapper>
  )
}

export function HeaderWrapper({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  const navigation = useNavigation()
  return (
    <header
      className={cn(
        'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between h-10 z-10 relative',
        className,
      )}
    >
      {children}
      {navigation.state !== 'idle' && (
        <LoadingLine className='absolute -bottom-px inset-x-0' />
      )}
    </header>
  )
}

export function HeaderBreadcrumbs() {
  const matches = useMatches()
  return (
    <ol className='flex items-center gap-2'>
      {matches
        .filter((match) => match.handle && match.handle.breadcrumb)
        .map((match, index) => (
          <Fragment key={match.id}>
            {index !== 0 && (
              <ChevronRight className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
            )}
            <li>
              <HeaderLink {...(match.handle as Handle).breadcrumb(match)} />
            </li>
          </Fragment>
        ))}
    </ol>
  )
}

export function HeaderLink({ className, ...etc }: LinkProps) {
  return (
    <Link
      className={cn('text-lg tracking-tighter lowercase', className)}
      {...etc}
    />
  )
}

export function HeaderActions() {
  const matches = useMatches()
  const user = useOptionalUser()
  const isLoginPage = matches.some((match) => match.id.includes('login'))
  return (
    <div className='flex items-center'>
      {!isLoginPage && user == null && <LogInButton />}
      {!isLoginPage && user != null && <LogOutButton />}
      {user?.username != null && (
        <Link
          aria-label='View profile'
          className={buttonVariants({ size: 'icon', variant: 'ghost' })}
          to={`/${user.username}`}
        >
          <User className='w-3 h-3' />
        </Link>
      )}
      {user != null && (
        <Link
          aria-label='Edit profile'
          className={buttonVariants({ size: 'icon', variant: 'ghost' })}
          to='/profile'
        >
          <Settings className='w-3 h-3' />
        </Link>
      )}
      <ThemeSwitcher />
    </div>
  )
}

function LogInButton() {
  return (
    <Link
      aria-label='Log in'
      className={buttonVariants({ size: 'icon', variant: 'ghost' })}
      to={`/login?redirectTo=${useRedirectTo()}`}
    >
      <LogIn className='w-3 h-3' />
    </Link>
  )
}

function LogOutButton() {
  const fetcher = useFetcher<typeof logoutAPI>()
  return (
    <fetcher.Form method='post' action='/api/logout'>
      <input type='hidden' name='redirectTo' value={useRedirectTo()} />
      <Button type='submit' size='icon' variant='ghost' aria-label='Log out'>
        <LogOut className='w-3 h-3' />
      </Button>
    </fetcher.Form>
  )
}
