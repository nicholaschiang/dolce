// Script to save the data scraped via `scripts/python/spiders/wwd.py` to the
// Postgres database via the Prisma ORM for type safe data transformations.
//
// Note that this script is meant to be run after the data from Vogue has
// already been imported. I intentionally use `upsert` instead of `create` to
// simply augment the existing shows. This _should_ also work in a clean
// database (i.e. if you just want WWD shows), but I haven't tested it.
//
// Another caveat for running this script, is that you *must* first remove the
// look unique index and ensure that the show names conform to the standard
// format. I have two Prisma migrations for this:
// - `20230802061514_derive_show_name_from_unique_columns`
// - `20230802071834_temporarily_remove_look_unique_constraint`
//
// Once you are done importing this data, you can run the following migration to
// combine duplicate looks and re-add the unique constraint:
// - `20230802193037_looks_can_have_multiple_images`

import fs from 'fs'
import path from 'path'

import {
  type Prisma,
  Sex,
  Level,
  Location,
  SeasonName,
  PrismaClient,
} from '@prisma/client'
import { DateTime } from 'luxon'
import ProgressBar from 'progress'

import { slug } from './utils'
import lookType from './wwd/look.json'
import showType from './wwd/show.json'

const DEBUG = false
const DRY_RUN = false
const PATH = '../../../../static/data/wwd.json'

type Show = typeof showType
type Look = typeof lookType

const seasonsWithParseWarnings = new Set<string>()

const wwd: Prisma.PublicationCreateInput = { name: 'WWD' }

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const everything = JSON.parse(json) as (Show | Look)[]
  const shows = everything.filter(
    (thing) => thing['@type'] === 'Show',
  ) as Show[]
  const looks = everything.filter(
    (thing) => thing['@type'] === 'Look',
  ) as Look[]
  const withLooks = shows.map((show) => ({
    ...show,
    looks: looks.filter((look) => look.show_url === show.url),
  }))
  log(`Parsing ${shows.length} shows...`)
  const data = withLooks.map(getData)
  log(`Parsed ${data.length} shows.`)
  let index = Number(process.argv[2])
  if (Number.isNaN(index)) index = 0
  const final = data.slice(index)
  log(`Starting at index ${index}, saving ${final.length} shows...`)
  const bar = new ProgressBar(
    'Saving WWD shows... [:bar] :rate/sps :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: final.length,
    },
  )
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const show of final) {
    try {
      if (!DRY_RUN)
        await prisma.show.upsert({
          where: { name: show.name },
          create: show,
          update: show,
        })
      bar.tick()
    } catch (error) {
      console.error(`Error while saving show:`, JSON.stringify(show, null, 2))
      console.error(error)
    }
  }
}

void save()

//////////////////////////////////////////////////////////////////

function log(...args: Parameters<typeof console.log>) {
  if (DEBUG) console.log(...args)
}

function strip(str: string) {
  return str.replace(/(?=\s)[^\r\n\t]/g, ' ').trim()
}

type ParsedSeason = {
  season: { name: SeasonName; year: number }
  level: Level
  sex: Sex
  location?: Location
}

function parseSeason(season: string, header: string): ParsedSeason {
  // e.g. "SPRING 2023 READY-TO-WEAR", "RESORT 2024", "TOKYO SPRING 2024"
  const sex =
    season.includes('Men') || header.includes('Men’s') ? Sex.MAN : Sex.WOMAN
  const level = season.includes('Couture') ? Level.COUTURE : Level.RTW
  const name = season.includes('Resort')
    ? SeasonName.RESORT
    : season.includes('Spring')
    ? SeasonName.SPRING
    : season.includes('Pre-Fall')
    ? SeasonName.PRE_FALL
    : season.includes('Fall')
    ? SeasonName.FALL
    : undefined
  if (name == null) throw new Error(`Could not find season name: ${season}`)
  const year = Number(/(\d{4})/.exec(season)?.[1])
  if (Number.isNaN(year)) throw new Error(`Could not find year: ${season}`)
  const location = season.toUpperCase().includes('NEW YORK')
    ? Location.NEW_YORK
    : season.toUpperCase().includes('LONDON')
    ? Location.LONDON
    : season.toUpperCase().includes('MILAN')
    ? Location.MILAN
    : season.toUpperCase().includes('PARIS')
    ? Location.PARIS
    : season.toUpperCase().includes('TOKYO')
    ? Location.TOKYO
    : season.toUpperCase().includes('BERLIN')
    ? Location.BERLIN
    : season.toUpperCase().includes('FLORENCE')
    ? Location.FLORENCE
    : season.toUpperCase().includes('LOS ANGELES')
    ? Location.LOS_ANGELES
    : season.toUpperCase().includes('MADRID')
    ? Location.MADRID
    : season.toUpperCase().includes('COPENHAGEN')
    ? Location.COPENHAGEN
    : season.toUpperCase().includes('SHANGHAI')
    ? Location.SHANGHAI
    : season.toUpperCase().includes('AUSTRALIA')
    ? Location.AUSTRALIA
    : season.toUpperCase().includes('STOCKHOLM')
    ? Location.STOCKHOLM
    : season.toUpperCase().includes('MEXICO')
    ? Location.MEXICO
    : season.toUpperCase().includes('MEXICO CITY')
    ? Location.MEXICO_CITY
    : season.toUpperCase().includes('KIEV')
    ? Location.KIEV
    : season.toUpperCase().includes('TBILISI')
    ? Location.TBILISI
    : season.toUpperCase().includes('SEOUL')
    ? Location.SEOUL
    : season.toUpperCase().includes('RUSSIA')
    ? Location.RUSSIA
    : season.toUpperCase().includes('UKRAINE')
    ? Location.UKRAINE
    : season.toUpperCase().includes('SÃO PAULO')
    ? Location.SAO_PAOLO
    : season.toUpperCase().includes('BRIDAL')
    ? Location.BRIDAL
    : undefined
  if (location == null && seasonsWithParseWarnings.has(season) === false) {
    console.warn(`Could not find location: ${season}`)
    seasonsWithParseWarnings.add(season)
  }
  return {
    season: { name, year },
    level,
    sex,
    location,
  }
}

function getData(show: Show & { looks: Look[] }) {
  try {
    const { season, sex, level, location, ...etc } = parseSeason(
      show.season,
      show.header,
    )
    let review: Prisma.ReviewCreateWithoutShowInput | undefined
    const date = show.date
      ? DateTime.fromFormat(strip(show.date), 'LLLL d, yyyy, h:mma').toString()
      : null
    log('Date:', strip(show.date))
    log('ISO:', date)
    if (show.author_name && show.author_url) {
      const author = { name: strip(show.author_name), url: show.author_url }
      log('Author:', author)
      review = {
        date,
        title: show.header,
        subtitle: show.excerpt ? strip(show.excerpt) : null,
        score: null,
        summary: null,
        content: show.content.join('\n'),
        url: show.url,
        author: {
          connectOrCreate: { where: { name: author.name }, create: author },
        },
        publication: {
          connectOrCreate: { where: { name: wwd.name }, create: wwd },
        },
      }
    }
    const header = strip(show.header)
    const matches =
      /(.+?) (?=Men’s|Couture|RTW|Resort|Pre-Fall|Fall|Spring|Summer|\d{4})/.exec(
        header,
      )
    const [_, brandName, ...everythingElse] = matches ?? []
    log('Header:', header)
    log('Matches:', matches)
    log('Derived:', { brandName, everythingElse })
    log('Parsed:', { season, sex, level, location, ...etc })
    const brand: Prisma.BrandCreateInput = {
      name: brandName,
      slug: slug(brandName),
      description: null,
      tier: null,
      avatar: null,
      url: null,
    }

    // The purpose of this `name` field is to match existing records imported
    // from other news sources (i.e. Vogue). The only shows where both Vogue and
    // WWD included location information were the Hyke Toyko shows.
    //
    // -- Gets the shows that were originally imported from Vogue with locations, and
    // -- had the same locations in WWD and thus the records merged as expected.
    // --
    // -- This query only returned 3 rows, meaning that I should probably simply omit
    // -- the location from the show name when merging from WWD (as there were more records
    // -- that were alike besides the location) and then manually merge those three.
    // --
    // -- Hyke FALL 2023 WOMAN RTW TOKYO, Hyke SPRING 2022 WOMAN RTW TOKYO, Hyke SPRING 2023 WOMAN RTW TOKYO
    // SELECT * FROM (
    //   SELECT "Show"."name", "Show"."location", COUNT("Review"."id") as "review_count"
    //   FROM "Show"
    //   LEFT OUTER JOIN "Review" ON "Review"."showId" = "Show"."id"
    //   GROUP BY "Show"."name", "Show"."location"
    // ) "Shows" WHERE "review_count" > 1 AND "location" != 'PARIS' AND "location" IS NOT NULL
    //
    // This does not lead to any loss of information as the show location is still
    // saved to our database even while the name doesn't include it.
    const loc = brandName === 'Hyke' ? location : ''
    const derived = `${season.name} ${season.year} ${sex} ${level} ${loc ?? ''}`
    const name = `${brandName} ${derived}`.trim()
    log('Name:', name)

    // TODO WWD will list the same collection twice (once under "Menswear" and
    // again without "Menswear") if that collection is unisex. I can fix this by
    // looking for collections that have the same review content and other data,
    // and then merge those collections under the same unisex name.
    const collection: Prisma.CollectionCreateInput = {
      name,
      season: {
        connectOrCreate: {
          where: { name_year: { name: season.name, year: season.year } },
          create: season,
        },
      },
    }
    const looks: Prisma.LookCreateWithoutShowInput[] = show.looks.map(
      (look) => {
        const image: Prisma.ImageCreateWithoutLookInput = {
          url: look.src.replace(/\?w=\d+$/, ''),
        }
        return {
          number: look.number,
          image: {
            connectOrCreate: { where: { url: image.url }, create: image },
          },
        }
      },
    )
    const data: Prisma.ShowCreateInput = {
      ...etc,
      name,
      sex,
      level,
      location,
      date,
      url: show.url,
      description: null,
      criticReviewSummary: null,
      consumerReviewSummary: null,
      reviews: review ? { create: review } : undefined,
      season: {
        connectOrCreate: {
          where: { name_year: { name: season.name, year: season.year } },
          create: season,
        },
      },
      collections: { connectOrCreate: { where: { name }, create: collection } },
      looks: { create: looks },
      brand: {
        connectOrCreate: { where: { slug: brand.slug }, create: brand },
      },
    }
    log('Data:', data)
    return data
  } catch (error) {
    console.error(`Error parsing show:`, JSON.stringify(show, null, 2))
    throw error
  }
}
