import {
  Link,
  type LinkProps,
  type UIMatch,
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

import { cn } from 'utils/cn'
import { useOptionalUser, useRedirectTo } from 'utils/general'

import { type Handle } from 'root'

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
        'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between h-10 z-10 relative gap-6',
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
  const matches = useMatches() as UIMatch<unknown, Handle<unknown>>[]
  return (
    <ol className='flex w-0 grow items-center gap-2'>
      {matches
        .filter((match) => match.handle && match.handle.breadcrumb)
        .flatMap((match) => match.handle.breadcrumb(match))
        .map((props, index) => (
          <Fragment key={index}>
            {index !== 0 && (
              <ChevronRight className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
            )}
            <li className='last:truncate'>
              <HeaderLink {...props} />
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
      prefetch='intent'
      {...etc}
    />
  )
}

export function HeaderActions() {
  const matches = useMatches()
  const user = useOptionalUser()
  const isLoginPage = matches.some(
    (match) => match.id.includes('login') || match.id.includes('join'),
  )
  return (
    <div className='flex-none flex items-center'>
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
