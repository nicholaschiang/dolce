import { prisma } from 'db.server'
import { type Score, type Scores } from 'utils/scores'

function sanityCheck(score: Score, name: string): void {
  const sum = score.positiveCount + score.negativeCount + score.neutralCount
  if (sum !== score.totalCount) {
    const error =
      `${name} total (${score.totalCount}) did not match sum ` +
      `(${score.positiveCount} + ${score.negativeCount} + ` +
      `${score.neutralCount} = ${sum})`
    throw new Error(error)
  }
}

export async function getScores(showId: number): Promise<Scores> {
  const [total, positive, neutral, negative] = await Promise.all([
    prisma.review.count({
      where: { showId, score: { not: null } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { gt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { equals: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { lt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
  ])
  const scores = {
    critic: {
      positiveCount: positive.publicationId,
      negativeCount: negative.publicationId,
      neutralCount: neutral.publicationId,
      totalCount: total.publicationId,
    },
    consumer: {
      /* eslint-disable no-underscore-dangle */
      positiveCount: positive._all - positive.publicationId,
      negativeCount: negative._all - negative.publicationId,
      neutralCount: neutral._all - neutral.publicationId,
      totalCount: total._all - total.publicationId,
      /* eslint-enable no-underscore-dangle */
    },
  }
  sanityCheck(scores.critic, 'Critic Score')
  sanityCheck(scores.consumer, 'Consumer Score')
  return scores
}
