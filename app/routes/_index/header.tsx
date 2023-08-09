import { ChevronRight, Plus } from 'lucide-react'
import { Fragment } from 'react'

import { HeaderWrapper, HeaderActions, HeaderLink } from 'components/header'

const links = [
  { to: '/shows', label: 'Shows' },
  { to: '/products', label: 'Products' },
  { to: '/brands', label: 'Brands' },
  { to: '/designers', label: 'Designers' },
]

export function Header({ className }: { className?: string }) {
  return (
    <HeaderWrapper className={className}>
      <ol className='flex items-center gap-2 text-lg tracking-tighter lowercase'>
        <h1>dolce</h1>
        <ChevronRight className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
        {links.map((link, index) => (
          <Fragment key={link.to}>
            {index !== 0 && (
              <Plus className='text-gray-300 dark:text-gray-600 h-4 w-4 mt-0.5' />
            )}
            <li className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors'>
              <HeaderLink prefetch='intent' to={link.to}>
                {link.label}
              </HeaderLink>
            </li>
          </Fragment>
        ))}
      </ol>
      <HeaderActions />
    </HeaderWrapper>
  )
}
