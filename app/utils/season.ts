import { type Season } from '@prisma/client'
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
