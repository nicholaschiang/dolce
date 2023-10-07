import { useLoaderData } from '@remix-run/react'

import { getBrandName } from 'utils/product'

import { type loader } from './route'

export function Header() {
  const product = useLoaderData<typeof loader>()
  return (
    <header className='sticky top-0 bg-gray-50 z-10 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3'>
      <h2 className='font-semibold'>{getBrandName(product)}</h2>
      <h1>{product.name}</h1>
    </header>
  )
}
