import {
  type Show,
  type Brand,
  type Collection,
  type Season,
} from '@prisma/client'
import { type SerializeFrom } from '@vercel/remix'

import { SEASON_NAME_TO_SLUG, getSeasonName } from 'utils/season'
import { SEX_TO_SLUG, getSexName } from 'utils/sex'

/**
 * Get the show season header (i.e. "SPRING 2021 MENSWEAR" or "RESORT 2024").
 * This is more convoluted than normal due to the weirdness with "Menswear".
 */
export function getShowSeason(
  show: SerializeFrom<Show & { collections: Collection[]; season: Season }>,
) {
  return `${getSeasonName(show.season)} ${getSexName(show.sex)}`
}

export function getShowPath(
  show: SerializeFrom<Show & { season: Season; brand: Brand }>,
) {
  const path = [
    show.season.year,
    SEASON_NAME_TO_SLUG[show.season.name],
    SEX_TO_SLUG[show.sex],
    show.brand.slug,
  ]
  return `/shows/${path.filter((p) => p !== '').join('/')}`
}
