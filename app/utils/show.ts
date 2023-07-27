import { Sex, type Show, type Collection, type Season } from '@prisma/client'
import { type SerializeFrom } from '@vercel/remix'

import { getSeasonName } from 'utils/season'

/**
 * Get the show sex header (i.e. "Menswear" or "") based on the collections sex.
 * If every collection in the show has a sex of "MAN", then "Menswear" will be
 * appended to the header. Otherwise, nothing will be appended.
 */
function getShowSex(show: SerializeFrom<Show>) {
  return show.sex === Sex.MAN ? 'Menswear' : ''
}

/**
 * Get the show season header (i.e. "SPRING 2021 MENSWEAR" or "RESORT 2024").
 * This is more convoluted than normal due to the weirdness with "Menswear".
 */
export function getShowSeason(
  show: SerializeFrom<Show & { collections: Collection[]; season: Season }>,
) {
  return `${getSeasonName(show.season)} ${getShowSex(show)}`
}
