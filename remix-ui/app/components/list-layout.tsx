import type { ReactNode } from 'react'

export type ListLayoutProps = { title: string; children: ReactNode[] }

export function ListLayout({ title, children }: ListLayoutProps) {
  return (
    <div className='flex h-full flex-1 items-center justify-center overflow-hidden'>
      <h1 className='my-4 mr-12 flex-1 pl-12 text-right text-6xl'>{title}</h1>
      <ul className='max-h-full flex-1 overflow-auto py-12 pr-12'>
        {children}
      </ul>
    </div>
  )
}
