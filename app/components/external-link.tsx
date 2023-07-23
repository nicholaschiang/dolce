import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from 'utils/cn'

const ExternalLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    target='_blank'
    rel='noopener noreferrer'
    className={cn('underline inline-flex items-center gap-0.5', className)}
    {...props}
  >
    {children}
    <ExternalLinkIcon className='h-3 w-3 flex-none' />
  </a>
))
ExternalLink.displayName = 'ExternalLink'

export { ExternalLink }
