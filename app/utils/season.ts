import { type Season, SeasonName } from '@prisma/client'
import { type SerializeFrom } from '@vercel/remix'

import { caps } from 'utils'

/**
 * Get the user-friendly season name from a season object (e.g. "Resort 2024").
 * @param season The season object.
 * @returns The user-friendly season name.
 */
export function getSeasonName(season: SerializeFrom<Season>): string {
  return `${caps(season.name.replace('_', '-'))} ${season.year}`
}

export const SEASON_NAME_TO_SLUG: Record<SeasonName, string> = {
  [SeasonName.FALL]: 'fall',
  [SeasonName.WINTER]: 'winter',
  [SeasonName.SPRING]: 'spring',
  [SeasonName.SUMMER]: 'summer',
  [SeasonName.RESORT]: 'resort',
  [SeasonName.SPRING_SUMMER]: 'ss',
  [SeasonName.FALL_WINTER]: 'fw',
}
