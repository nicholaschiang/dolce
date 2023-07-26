import { Sex, type Collection, type Season } from '@prisma/client'
import { type SerializeFrom } from '@vercel/remix'

import { getSeasonName } from 'utils/season'

/**
 * Get the show sex header (i.e. "Menswear" or "") based on the collections sex.
 * If every collection in the show has a sex of "MAN", then "Menswear" will be
 * appended to the header. Otherwise, nothing will be appended.
 */
function getShowSex(show: SerializeFrom<{ collections: Collection[] }>) {
  const sex = show.collections
    .map((collection) => collection.sex)
    .every((value) => value === Sex.MAN)
    ? 'Menswear'
    : ''
  return sex
}

/**
 * Get the show season header (i.e. "SPRING 2021 MENSWEAR" or "RESORT 2024").
 * This is more convoluted than normal due to the weirdness with "Menswear".
 */
export function getShowSeason(
  show: SerializeFrom<{ collections: Collection[]; season: Season }>,
) {
  const sex = getShowSex(show)
  return `${getSeasonName(show.season)} ${sex}`
}
