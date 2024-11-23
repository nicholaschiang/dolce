import cn from 'classnames'

export function Hotkey({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'rounded-sm bg-gray-200/50 py-0.5 px-1 text-3xs text-gray-500/50 dark:bg-gray-700/50 dark:text-gray-400/50',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
