import { cn } from 'utils/cn'

export function LoadingLine({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn(
        'h-px border-0 relative w-full bg-gray-200 dark:bg-gray-800 after:w-1/2 after:h-px after:absolute after:opacity-0 after:bg-gradient-to-r after:from-transparent after:via-gray-400 after:dark:via-gray-600 after:to-transparent after:animate-load',
        className,
      )}
      {...props}
    />
  )
}
