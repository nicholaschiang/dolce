import { type Score, type Scores } from 'utils/scores'

import { prisma } from 'db.server'

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

export async function getScores(collectionId: number): Promise<Scores> {
  const [
    consumerTotal,
    consumerPositive,
    consumerNeutral,
    consumerNegative,
    criticTotal,
    criticPositive,
    criticNeutral,
    criticNegative,
  ] = await Promise.all([
    prisma.review.count({
      where: { collectionId },
      select: { _all: true },
    }),
    prisma.review.count({
      where: { collectionId, score: { gt: 0.5 } },
      select: { _all: true },
    }),
    prisma.review.count({
      where: { collectionId, score: { equals: 0.5 } },
      select: { _all: true },
    }),
    prisma.review.count({
      where: { collectionId, score: { lt: 0.5 } },
      select: { _all: true },
    }),
    prisma.article.count({
      where: { collectionId, score: { not: null } },
      select: { _all: true },
    }),
    prisma.article.count({
      where: { collectionId, score: { gt: 0.5 } },
      select: { _all: true },
    }),
    prisma.article.count({
      where: { collectionId, score: { equals: 0.5 } },
      select: { _all: true },
    }),
    prisma.article.count({
      where: { collectionId, score: { lt: 0.5 } },
      select: { _all: true },
    }),
  ])
  const scores = {
    critic: {
      positiveCount: criticPositive._all,
      negativeCount: criticNegative._all,
      neutralCount: criticNeutral._all,
      totalCount: criticTotal._all,
    },
    consumer: {
      positiveCount: consumerPositive._all,
      negativeCount: consumerNegative._all,
      neutralCount: consumerNeutral._all,
      totalCount: consumerTotal._all,
    },
  }
  sanityCheck(scores.critic, 'Critic Score')
  sanityCheck(scores.consumer, 'Consumer Score')
  return scores
}
