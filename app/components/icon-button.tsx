import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import cn from 'classnames'

export default function IconButton({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button type='button' className={cn('icon-button', className)} {...props} />
  )
}
