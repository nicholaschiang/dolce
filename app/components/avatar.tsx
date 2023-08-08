import * as React from 'react'

import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from 'components/ui/avatar'

type Source = { name: string; avatar?: string | null }

function getFallback(src?: Source | null) {
  return src?.name
    .split(' ')
    .slice(0, 2)
    .map((s) => s.substring(0, 1))
    .join('')
    .toUpperCase()
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarRoot>,
  React.ComponentPropsWithoutRef<typeof AvatarRoot> & { src?: Source | null }
>(({ src, children, ...props }, ref) => (
  <AvatarRoot ref={ref} {...props}>
    <AvatarImage src={src?.avatar ?? undefined} alt={src?.name} />
    <AvatarFallback>{getFallback(src)}</AvatarFallback>
    {children}
  </AvatarRoot>
))
Avatar.displayName = AvatarRoot.displayName

export { Avatar, getFallback }
