import { useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'
import { LayoutSection } from 'components/layout'

import { type loader } from './route'

export function WhatToKnow() {
  const collection = useLoaderData<typeof loader>()
  if (
    collection.articlesConsensus == null &&
    collection.reviewsConsensus == null
  )
    return null
  return (
    <LayoutSection header='What to know' id='what-to-know'>
      <Subheader>Critics Consensus</Subheader>
      {collection.articlesConsensus ? (
        <p className='mb-2'>{collection.articlesConsensus}</p>
      ) : (
        <Empty className='mb-2'>
          There is no Critics Consensus because there are not enough reviews
          yet.
        </Empty>
      )}
      <Subheader>Consumers Say</Subheader>
      {collection.reviewsConsensus ? (
        <p>{collection.reviewsConsensus}</p>
      ) : (
        <Empty>
          There is no Consumer Summary because there are not enough reviews yet.
        </Empty>
      )}
    </LayoutSection>
  )
}

function Subheader({ children }: { children: string }) {
  return <h2 className='font-semibold'>{children}</h2>
}
