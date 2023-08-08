import { type Season, SeasonName } from '@prisma/client'

import { type Serialize, caps } from 'utils/general'

/**
 * Get the user-friendly season name from a season object (e.g. "Resort 2024").
 * @param season The season object.
 * @returns The user-friendly season name.
 */
export function getSeasonName(season: Serialize<Season>): string {
  const name = caps(season.name.replace('_', ' ')).replace(' ', '-')
  return `${name} ${season.year}`
}

export const SEASON_NAME_TO_SLUG: Record<SeasonName, string> = {
  [SeasonName.FALL]: 'fall',
  [SeasonName.PRE_FALL]: 'pre-fall',
  [SeasonName.SPRING]: 'spring',
  [SeasonName.RESORT]: 'resort',
}
