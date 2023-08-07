import { FGIt as Italy } from '@icongo/fg'
import { Link } from '@remix-run/react'
import { ChevronRight, Plus } from 'lucide-react'
import { type PropsWithChildren, Fragment } from 'react'

import { HeaderWrapper, HeaderActions } from 'components/header'

export default function IndexPage() {
  return (
    <>
      <Header />
      <Hero />
    </>
  )
}

const links = [
  { to: '/shows', label: 'Shows' },
  { to: '/products', label: 'Products' },
  { to: '/brands', label: 'Brands' },
  { to: '/designers', label: 'Designers' },
]

function Header() {
  return (
    <HeaderWrapper>
      <ol className='flex items-center gap-2 text-lg tracking-tighter lowercase'>
        <h1>dolce</h1>
        <ChevronRight className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
        {links.map((link, index) => (
          <Fragment key={link.to}>
            {index !== 0 && (
              <Plus className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
            )}
            <li className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors'>
              <Link prefetch='intent' to={link.to}>
                {link.label}
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
      <HeaderActions />
    </HeaderWrapper>
  )
}

function Hero() {
  return (
    <main className='flex flex-col sm:flex-row sm:items-center justify-center mt-6 p-6 gap-6'>
      <div className='aspect-square w-full sm:w-72 sm:h-72 bg-gray-100 dark:bg-gray-900'>
        <img src='/brands.jpg' className='object-cover h-full w-full' alt='' />
      </div>
      <article>
        <h1 className='text-2xl font-medium mb-4 tracking-tighter flex items-center gap-0.5'>
          <span>dol</span>
          <span>·</span>
          <span>ce</span>
        </h1>
        <dl>
          <Definition label='adverb'>
            (especially as a direction) sweetly and softly.
          </Definition>
          <Definition label='adjective'>
            performed in a sweet and soft manner.
          </Definition>
          <Definition label='origin'>
            <Italy className='border border-gray-900 dark:border-white rounded-full mt-1' />
          </Definition>
        </dl>
      </article>
    </main>
  )
}

function Definition({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <>
      <dt className='italic text-gray-400 dark:text-gray-600'>{label}</dt>
      <dd className='mb-4'>{children}</dd>
    </>
  )
}
