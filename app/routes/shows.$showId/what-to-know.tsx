import { useLoaderData } from '@remix-run/react'

import { Empty } from 'components/empty'

import { type loader } from './route'
import { Section } from './section'

export function WhatToKnow() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header='What to know' id='what-to-know'>
      <Subheader>Critics Consensus</Subheader>
      {show.criticReviewSummary ? (
        <p className='mb-2'>{show.criticReviewSummary}</p>
      ) : (
        <Empty className='mb-2'>
          There is no Critics Consensus because there are not enough reviews
          yet.
        </Empty>
      )}
      <Subheader>Consumers Say</Subheader>
      {show.consumerReviewSummary ? (
        <p>{show.consumerReviewSummary}</p>
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
