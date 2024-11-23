import { Link } from '@remix-run/react'
import { Link as LinkIcon } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import {
  type PanelProps,
  type PanelGroupProps,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'

import { buttonVariants } from 'components/ui/button'

import { cn } from 'utils/cn'
import { slug } from 'utils/general'

export function Layout({ className, ...etc }: Partial<PanelGroupProps>) {
  return (
    <PanelGroup
      direction='horizontal'
      className={cn('h-0 grow overflow-hidden', className)}
      {...etc}
    />
  )
}

export function LayoutLeft({ className, ...etc }: Partial<PanelProps>) {
  return (
    <Panel
      defaultSize={65}
      minSize={50}
      maxSize={80}
      className={cn('overflow-hidden h-full flex flex-col', className)}
      {...etc}
    />
  )
}

export function LayoutRight({ className, ...etc }: Partial<PanelProps>) {
  return (
    <Panel
      defaultSize={35}
      minSize={30}
      maxSize={40}
      tagName='aside'
      className={cn(
        '!overflow-y-auto !overflow-x-hidden h-full shadow-lg',
        className,
      )}
      {...etc}
    />
  )
}

export function LayoutDivider() {
  return (
    <PanelResizeHandle className='z-20 data-[panel-group-direction=horizontal]:border-l data-[panel-group-direction=vertical]:border-t border-gray-200 dark:border-gray-800 relative group'>
      <div className='w-2 group-data-[panel-group-direction=horizontal]:-left-1 group-data-[panel-group-direction=vertical]:-top-1 absolute group-data-[panel-group-direction=horizontal]:inset-y-0 group-data-[panel-group-direction=vertical]:inset-x-0 after:absolute after:group-data-[panel-group-direction=horizontal]:inset-y-0 after:group-data-[panel-group-direction=horizontal]:left-0.5 after:group-data-[panel-group-direction=horizontal]:w-0.5 after:group-data-[panel-group-direction=vertical]:inset-x-0 after:group-data-[panel-group-direction=vertical]:top-0.5 after:group-data-[panel-group-direction=vertical]:h-0.5 after:bg-gray-400 after:dark:bg-gray-600 after:opacity-0 after:group-data-[resize-handle-active]:opacity-100 hover:after:opacity-100 after:transition-opacity after:pointer-events-none' />
    </PanelResizeHandle>
  )
}

export function LayoutSection({
  id: initialId,
  header,
  children,
  className,
}: PropsWithChildren<{ id?: string; header: string; className?: string }>) {
  const id = initialId ?? slug(header)
  return (
    <section
      className={cn(
        'p-6 border-b border-gray-200 dark:border-gray-800 last:border-0 group/section',
        className,
      )}
      id={id}
    >
      <h1 className='font-medium mb-4 text-sm flex items-center justify-between gap-1 text-gray-500'>
        {header}
        <Link
          to={`#${id}`}
          className={cn(
            buttonVariants({
              size: 'icon',
              variant: 'ghost',
              className:
                'opacity-0 group-hover/section:opacity-100 transition-all',
            }),
          )}
        >
          <LinkIcon className='w-3 h-3' />
        </Link>
      </h1>
      {children}
    </section>
  )
}
