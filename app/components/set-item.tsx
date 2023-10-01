import { Link } from '@remix-run/react'

import { type SetItem as SetItemT } from 'utils/set'

export function SetItem({ item }: { item: SetItemT }) {
  return (
    <li>
      <Link
        to={item.url}
        prefetch='intent'
        className='aspect-person bg-gray-100 dark:bg-gray-900 block'
      >
        {item.images.length > 0 && (
          <img
            className='object-cover w-full h-full'
            src={item.images[0].url}
            alt=''
          />
        )}
      </Link>
    </li>
  )
}
