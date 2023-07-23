import { type PropsWithChildren } from 'react'

export function Section({
  header,
  children,
}: PropsWithChildren<{ header: string }>) {
  return (
    <section className='grid gap-2'>
      <h1 className='border-l-2 border-emerald-700 pl-1.5 font-medium text-base uppercase'>
        {header}
      </h1>
      {children}
    </section>
  )
}
