import { type LinkProps, Link } from '@remix-run/react'
import { type HTMLAttributes } from 'react'

import { cn } from 'utils/cn'

function Item({ className, to, ...props }: LinkProps) {
  return (
    <Link
      to={to}
      prefetch='intent'
      className={cn(
        'flex flex-col gap-2 text-xs',
        to === '' && 'cursor-wait',
        className,
      )}
      {...props}
    />
  )
}
Item.displayName = 'Item'

function ItemContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}
ItemContent.displayName = 'ItemContent'

function ItemTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  if (children == null || children === '') return null
  return (
    <h2 className={cn('font-semibold uppercase', className)} {...props}>
      {children}
    </h2>
  )
}
ItemTitle.displayName = 'ItemTitle'

function ItemSubtitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  if (children == null || children === '') return null
  return (
    <h3 className={className} {...props}>
      {children}
    </h3>
  )
}
ItemSubtitle.displayName = 'ItemSubtitle'

function ItemDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  if (children == null || children === '') return null
  return (
    <p className={cn('text-gray-400 dark:text-gray-500', className)} {...props}>
      {children}
    </p>
  )
}
ItemDescription.displayName = 'ItemDescription'

export { Item, ItemContent, ItemTitle, ItemSubtitle, ItemDescription }
