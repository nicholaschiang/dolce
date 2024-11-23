import {
  type Brand,
  type Show,
  type Season,
  type Look,
  type Image,
  type User,
  type Collection,
  Level,
} from '@prisma/client'
import { type Event, type Person, type WithContext } from 'schema-dts'

import { getBrandSchema } from 'utils/brand'
import { type Serialize, url } from 'utils/general'
import { LEVEL_TO_SLUG } from 'utils/level'
import { LOCATION_TO_SLUG } from 'utils/location'
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
 * Get the collection season header (i.e. "SPRING 2021 MENSWEAR" or "RESORT 2024").
 * This is more convoluted than normal due to the weirdness with "Menswear".
 */
export function getCollectionSeason(
  collection: Serialize<Collection & { season: Season }>,
) {
  return [
    getSeasonName(collection.season),
    getLevelName(collection.level),
    getSexName(collection.sex),
  ]
    .filter((s) => s)
    .join(' ')
}

/**
 * Get the collection path URL (e.g. /collections/2023/spring/man/hermes). This was placed
 * as a utility function so that it can be easily reused throughout the app.
 */
export function getCollectionPath(
  collection: Serialize<Collection & { season: Season; brand: Brand }>,
) {
  const path = [
    collection.location ? LOCATION_TO_SLUG[collection.location] : undefined,
    collection.season.year,
    SEASON_NAME_TO_SLUG[collection.season.name],
    SEX_TO_SLUG[collection.sex],
    LEVEL_TO_SLUG[collection.level],
    collection.brand.slug,
  ]
  return `/collections/${path.filter((p) => p).join('/')}`
}

/**
 * Get the collection's keywords (both used for the keywords meta tag and the keywords
 * field in the `Event` Schema.org `application/ld+json` compatible type).
 *
 * The values in this array are inspired by the ones used by Vogue Runway.
 * @see {@link https://www.vogue.com/fashion-collections/resort-2024/erdem}
 *
 * @see {@link https://www.wordstream.com/meta-keyword}
 * @see {@link https://schema.org/Event}
 */
export function getCollectionKeywords(
  collection: Serialize<Collection & { brand: Brand; season: Season }>,
) {
  return [
    collection.brand.name,
    getCollectionSeason(collection),
    'runway_review',
    'runway',
  ]
}

/**
 * Get the collection Schema.org `application/ld+json` compatible representation. This
 * is used primarily to provide search engines like Google with the structured
 * data required to render rich search results (e.g. like Rotten Tomatoes).
 * @see {@link https://linear.app/nicholaschiang/issue/NC-667}
 * @see {@link https://schema.org/Event}
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data/review-snippet}
 * @see {@link https://developers.google.com/search/docs/appearance/structured-data}
 */
export function getCollectionSchema(
  collection: Serialize<
    Collection & {
      designers: User[]
      looks: (Look & { images: Image[]; model: User | null })[]
      shows: Show[]
      season: Season
      brand: Brand
      scores: Scores
    }
  >,
): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    '@id': collection.id.toString(),
    'name': collection.name,
    'image': url(collection.looks[0]?.images[0]?.url),
    'startDate': collection.shows[0]?.date?.toString() ?? undefined,
    'location': collection.location ?? undefined,
    'description': collection.description ?? undefined,
    'url': url(getCollectionPath(collection)),
    'sameAs': url(collection.shows[0]?.url),
    'composer': collection.designers.map(getUserSchema),
    'performer': collection.looks
      .map((look) => (look.model ? getUserSchema(look.model) : null))
      .filter((look) => look != null) as Person[],
    'workFeatured': collection.looks.map(getLookSchema),
    'organizer': getBrandSchema(collection.brand),
    'aggregateRating': getScoresSchema(collection.scores),
    'keywords': getCollectionKeywords(collection),
  }
}
