import { Link } from '@remix-run/react'
import { Link as LinkIcon } from 'lucide-react'
import { type PropsWithChildren } from 'react'

export function Section({
  id,
  header,
  children,
}: PropsWithChildren<{ id: string; header: string }>) {
  return (
    <section className='grid gap-2 pt-10' id={id}>
      <h1 className='border-l-2 border-emerald-700 pl-1.5 font-medium text-base uppercase flex items-center gap-1 group'>
        {header}
        <Link
          to={`#${id}`}
          className='opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <LinkIcon className='w-4 h-4 text-gray-400 dark:text-gray-600' />
        </Link>
      </h1>
      {children}
    </section>
  )
}
