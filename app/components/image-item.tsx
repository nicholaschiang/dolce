import { Link, type LinkProps } from '@remix-run/react'

import { Image } from 'components/image'

import { cn } from 'utils/cn'

export function ImageItem({
  image,
  className,
  ...etc
}: { image?: string } & LinkProps) {
  return (
    <li>
      <Link
        prefetch='intent'
        className={cn(
          'aspect-person bg-gray-100 dark:bg-gray-900 block',
          className,
        )}
        {...etc}
      >
        {image && (
          <Image className='object-cover w-full h-full' src={image} alt='' />
        )}
      </Link>
    </li>
  )
}
