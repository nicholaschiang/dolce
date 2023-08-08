import { type AggregateRating } from 'schema-dts'

import { type Serialize } from 'utils/general'

/**
 * The show "scores" are calculate based on the number of positive and negative
 * reviews there are. The actual calculation of these scores cannot be placed
 * alongside these type definitions as it requires Prisma access (SSR-only).
 */
export type Score = {
  positiveCount: number
  negativeCount: number
  neutralCount: number
  totalCount: number
}
export type Scores = { critic: Score; consumer: Score }

/**
 * Calculate the score percentage (out of 100%) to show to users.
 */
export function getScorePercentage(score: Score): number {
  return Math.floor((score.positiveCount / score.totalCount) * 100)
}

/**
 * Get the score Schema.org `application/ld+json` compatible representation.
 * @todo distinguish between `reviewCount` and `ratingCount` (e.g. there are
 * reviews in the database that do not have a score assigned to them).
 */
export function getScoresSchema(scores: Serialize<Scores>): AggregateRating {
  return {
    '@type': 'AggregateRating',
    'description':
      'The Critic Score—based on the opinions of hundreds of fashion critics—' +
      'is a trusted measurement of critical recommendation for millions of ' +
      'consumers. The Critic Score represents the percentage of professional ' +
      'critic reviews that are positive for a given runway show. A Critic ' +
      'Score is calculated for a runway show after it receives at least five ' +
      'reviews.',
    'name': 'Critic Score',
    'reviewCount': scores.critic.totalCount,
    'ratingCount': scores.critic.totalCount,
    'ratingValue': getScorePercentage(scores.critic),
    'bestRating': 100,
    'worstRating': 0,
  }
}
