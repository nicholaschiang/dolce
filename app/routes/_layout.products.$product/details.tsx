import { useLoaderData } from '@remix-run/react'

import { LayoutSection } from 'components/layout'
import { Prose } from 'components/prose'

import { type loader } from './route'

export function Details() {
  const product = useLoaderData<typeof loader>()
  if (product.description == null) return null
  return (
    <LayoutSection id='details' header='Details'>
      <Prose content={product.description} />
    </LayoutSection>
  )
}
