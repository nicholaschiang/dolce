import { SeasonName } from '@prisma/client'
import { ChevronRight, Plus } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import { Fragment } from 'react'

import { HeaderWrapper, HeaderActions, HeaderLink } from 'components/header'

import { FILTER_PARAM, filterToSearchParam } from 'filters'

// Link to the latest season of shows automatically (like Vogue's homepage).
const param = filterToSearchParam<'season', 'is'>({
  id: nanoid(5),
  name: 'season',
  condition: 'is',
  value: { id: 106, name: SeasonName.RESORT, year: 2024 },
})

const links = [
  { to: `/shows?${FILTER_PARAM}=${encodeURIComponent(param)}`, label: 'Shows' },
  { to: '/products', label: 'Products' },
  { to: '/brands', label: 'Brands' },
  { to: '/styles', label: 'Styles' },
  { to: '/seasons', label: 'Seasons' },
  { to: '/sets', label: 'Sets' },
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
