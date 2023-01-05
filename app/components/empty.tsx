import type { ReactNode } from 'react';
import cn from 'classnames';

export interface EmptyProps {
  children?: ReactNode;
  className?: string;
}

export default function Empty({ children, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded border border-dashed border-gray-900/25 p-6 text-center text-sm font-normal text-gray-900/25 dark:border-gray-100/25 dark:text-gray-100/25',
        className
      )}
    >
      {children}
    </div>
  );
}
