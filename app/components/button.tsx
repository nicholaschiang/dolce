import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import cn from 'classnames'

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { outlined?: boolean }

export function Button({ outlined, className, ...props }: ButtonProps) {
  return (
    <button
      type='button'
      className={cn('button', outlined && 'outlined', className)}
      {...props}
    />
  )
}
