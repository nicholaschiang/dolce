import { Slot } from '@radix-ui/react-slot'
import { type PropsWithChildren } from 'react'

import { cn } from 'utils/cn'

export function Prose({
  asChild,
  maxWidth,
  className,
  content,
  children,
}: PropsWithChildren<{
  asChild?: boolean
  maxWidth?: boolean
  className?: string
  content: string
}>) {
  const Comp = asChild ? Slot : 'article'
  return (
    <Comp
      className={cn(
        'prose prose-sm prose-zinc dark:prose-invert',
        maxWidth ? undefined : 'max-w-none',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    >
      {children}
    </Comp>
  )
}
