import {
  type Show,
  type Brand,
  type Collection,
  type Season,
  type Look,
  type Image,
  type User,
  Level,
} from '@prisma/client'
import { type Event, type Person, type WithContext } from 'schema-dts'

import { getBrandSchema } from 'utils/brand'
import { type Serialize, url } from 'utils/general'
import { getLookSchema } from 'utils/look'
import { type Scores, getScoresSchema } from 'utils/scores'
import { SEASON_NAME_TO_SLUG, getSeasonName } from 'utils/season'
import { SEX_TO_SLUG, getSexName } from 'utils/sex'
import { getUserSchema } from 'utils/user'

export function getLevelName(level: Level): string {
  switch (level) {
    case Level.BESPOKE:
      return 'Bespoke'
    case Level.COUTURE:
      return 'Couture'
    case Level.HANDMADE:
      return 'Handmade'
    case Level.RTW:
      return 'RTW'
    default:
      throw new Error(`Unknown level: ${level}`)
  }
}

/**
 * Get the show season header (i.e. "SPRING 2021 MENSWEAR" or "RESORT 2024").
 * This is more convoluted than normal due to the weirdness with "Menswear".
 */
export function getShowSeason(show: Serialize<Show & { season: Season }>) {
  return [
    getSeasonName(show.season),
    getLevelName(show.level),
    getSexName(show.sex),
  ]
    .filter((s) => s)
    .join(' ')
}

/**
 * Get the show path URL (e.g. /shows/2023/spring/man/hermes). This was placed
 * as a utility function so that it can be easily reused throughout the app.
 */
export function getShowPath(
  show: Serialize<Show & { season: Season; brand: Brand }>,
) {
  const path = [
    show.season.year,
    SEASON_NAME_TO_SLUG[show.season.name],
    SEX_TO_SLUG[show.sex],
    show.brand.slug,
  ]
  return `/shows/${path.filter((p) => p !== '').join('/')}`
}

/**
 * Get the show's keywords (both used for the keywords meta tag and the keywords
 * field in the `Event` Schema.org `application/ld+json` compatible type).
 *
 * The values in this array are inspired by the ones used by Vogue Runway.
 * @see {@link https://www.vogue.com/fashion-shows/resort-2024/erdem}
 *
 * @see {@link https://www.wordstream.com/meta-keyword}
 * @see {@link https://schema.org/Event}
 */
export function getShowKeywords(
  show: Serialize<Show & { brand: Brand; season: Season }>,
) {
  return [show.brand.name, getShowSeason(show), 'runway_review', 'runway']
}

/**
 * Get the show Schema.org `application/ld+json` compatible representation. This
 * is used primarily to provide search engines like Google with the structured
 * data required to render rich search results (e.g. like Rotten Tomatoes).
 * @see {@link https://linear.app/nicholaschiang/issue/NC-667}
 * @see {@link https://schema.org/Event}
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data/review-snippet}
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data}
 */
export function getShowSchema(
  show: Serialize<
    Show & {
      looks: (Look & { images: Image[]; model: User | null })[]
      collections: (Collection & { designers: User[] })[]
      season: Season
      brand: Brand
      scores: Scores
    }
  >,
): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    '@id': show.id.toString(),
    'name': show.name,
    'image': url(show.looks[0]?.images[0]?.url),
    'startDate': show.date?.toString() ?? undefined,
    'location': show.location ?? undefined,
    'description': show.description ?? undefined,
    'url': url(getShowPath(show)),
    'sameAs': url(show.url),
    'composer': show.collections.flatMap((c) => c.designers.map(getUserSchema)),
    'performer': show.looks
      .map((look) => (look.model ? getUserSchema(look.model) : null))
      .filter((look) => look != null) as Person[],
    'workFeatured': show.looks.map(getLookSchema),
    'organizer': getBrandSchema(show.brand),
    'aggregateRating': getScoresSchema(show.scores),
    'keywords': getShowKeywords(show),
  }
}
