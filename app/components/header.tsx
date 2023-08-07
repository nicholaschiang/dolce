import { Link, type LinkProps, useMatches } from '@remix-run/react'
import { User, LogIn, LogOut, ChevronRight } from 'lucide-react'
import { type PropsWithChildren, Fragment } from 'react'

import { ThemeSwitcher } from 'components/theme-switcher'
import { buttonVariants } from 'components/ui/button'

import { type Handle } from 'root'
import { useOptionalUser } from 'utils'
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
  return (
    <header
      className={cn(
        'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between h-10 z-10',
        className,
      )}
    >
      {children}
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
  return (
    <div className='flex items-center'>
      {!matches.some((match) => match.id.includes('login')) && (
        <Link
          aria-label={user ? 'Log out' : 'Log in'}
          className={buttonVariants({ size: 'icon', variant: 'ghost' })}
          to={user ? '/logout' : '/login'}
        >
          {user ? (
            <LogOut className='w-3 h-3' />
          ) : (
            <LogIn className='w-3 h-3' />
          )}
        </Link>
      )}
      {user && (
        <Link
          aria-label='Edit profile'
          className={buttonVariants({ size: 'icon', variant: 'ghost' })}
          to='/profile'
        >
          <User className='w-3 h-3' />
        </Link>
      )}
      <ThemeSwitcher />
    </div>
  )
}
