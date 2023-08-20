import { useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

export function WhatToKnow() {
  const show = useLoaderData<typeof loader>()
  if (show.articlesConsensus == null && show.reviewsConsensus == null)
    return null
  return (
    <Section header='What to know' id='what-to-know'>
      <Subheader>Critics Consensus</Subheader>
      {show.articlesConsensus ? (
        <p className='mb-2'>{show.articlesConsensus}</p>
      ) : (
        <Empty className='mb-2'>
          There is no Critics Consensus because there are not enough reviews
          yet.
        </Empty>
      )}
      <Subheader>Consumers Say</Subheader>
      {show.reviewsConsensus ? (
        <p>{show.reviewsConsensus}</p>
      ) : (
        <Empty>
          There is no Consumer Summary because there are not enough reviews yet.
        </Empty>
      )}
    </Section>
  )
}

function Subheader({ children }: { children: string }) {
  return <h2 className='font-semibold'>{children}</h2>
}
