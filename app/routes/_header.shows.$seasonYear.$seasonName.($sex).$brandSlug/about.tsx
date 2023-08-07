import { cn } from 'utils/cn'

import { ConsumerReviews } from './consumer-reviews'
import { CriticReviews } from './critic-reviews'
import { Designers } from './designers'
import { RateAndReview } from './rate-and-review'
import { ScoresHeader } from './scores-header'
import { ShowInfo } from './show-info'
import { WhatToKnow } from './what-to-know'
import { WhereToBuy } from './where-to-buy'

export function About({ className }: { className: string }) {
  return (
    <div className={cn('overflow-auto', className)}>
      <ScoresHeader />
      <WhatToKnow />
      <Designers />
      <WhereToBuy />
      <RateAndReview />
      <ConsumerReviews />
      <ShowInfo />
      <CriticReviews />
    </div>
  )
}
