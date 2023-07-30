// Script to save the data scraped via `scripts/python/spiders/vogue.py` to the
// Postgres database via the Prisma ORM for type safe data transformations.

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
import ProgressBar from 'progress'

import { slug } from './utils'
import example from './vogue/resort-2024.json'

const PATH = '../../../public/data/vogue/shows.json'

type Show = (typeof example)[number]

const vogue: Prisma.PublicationCreateInput = {
  name: 'Vogue',
  avatar: 'https://www.vogue.com/verso/static/vogue/assets/us/logo.svg',
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const shows = JSON.parse(json) as Show[]
  const bar = new ProgressBar(
    'saving vogue shows [:bar] :rate/sps :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: shows.length,
    },
  )
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const show of shows) {
    const data = getData(show)
    try {
      await prisma.show.create({ data })
      bar.tick()
    } catch (error) {
      console.error(`Error while saving show:`, show)
      console.error(`Error while saving data:`, data)
      throw error
    }
  }
}

void save()

//////////////////////////////////////////////////////////////////

function caps(sentence: string): string {
  return sentence
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join(' ')
}

type ParsedSeason = {
  season: { name: SeasonName; year: number }
  level: Level
  sex: Sex
  location?: Location
}

function parseSeason(season: string): ParsedSeason {
  // e.g. "SPRING 2023 READY-TO-WEAR", "RESORT 2024", "TOKYO SPRING 2024"
  const sex = season.includes('MENSWEAR') ? Sex.MAN : Sex.WOMAN
  const level = season.includes('COUTURE') ? Level.COUTURE : Level.RTW
  const name = season.includes('RESORT')
    ? SeasonName.RESORT
    : season.includes('SPRING')
    ? SeasonName.SPRING
    : season.includes('PRE-FALL')
    ? SeasonName.PRE_FALL
    : season.includes('FALL')
    ? SeasonName.FALL
    : undefined
  if (name == null) throw new Error(`Could not find season name: ${season}`)
  const year = Number(/(\d{4})/.exec(season)?.[1])
  if (Number.isNaN(year)) throw new Error(`Could not find year: ${season}`)
  const location = season.includes('NEW YORK')
    ? Location.NEW_YORK
    : season.includes('LONDON')
    ? Location.LONDON
    : season.includes('MILAN')
    ? Location.MILAN
    : season.includes('PARIS')
    ? Location.PARIS
    : season.includes('TOKYO')
    ? Location.TOKYO
    : season.includes('BERLIN')
    ? Location.BERLIN
    : season.includes('FLORENCE')
    ? Location.FLORENCE
    : season.includes('LOS ANGELES')
    ? Location.LOS_ANGELES
    : season.includes('MADRID')
    ? Location.MADRID
    : season.includes('COPENHAGEN')
    ? Location.COPENHAGEN
    : season.includes('SHANGAI')
    ? Location.SHANGAI
    : season.includes('AUSTRALIA')
    ? Location.AUSTRALIA
    : season.includes('STOCKHOLM')
    ? Location.STOCKHOLM
    : season.includes('MEXICO')
    ? Location.MEXICO
    : season.includes('MEXICO CITY')
    ? Location.MEXICO_CITY
    : season.includes('KIEV')
    ? Location.KIEV
    : season.includes('TBILISI')
    ? Location.TBILISI
    : season.includes('SEOUL')
    ? Location.SEOUL
    : season.includes('RUSSIA')
    ? Location.RUSSIA
    : season.includes('UKRAINE')
    ? Location.UKRAINE
    : season.includes('SÃO PAULO')
    ? Location.SAO_PAOLO
    : season.includes('BRIDAL')
    ? Location.BRIDAL
    : undefined
  if (location == null) console.warn(`\nCould not find location: ${season}\n`)
  return {
    season: { name, year },
    level,
    sex,
    location,
  }
}

function getData(show: Show) {
  const { season, ...etc } = parseSeason(show.season)
  let review: Prisma.ReviewCreateWithoutShowInput | undefined
  if (show.author_name && show.author_url)
    review = {
      title: show.title,
      subtitle: null,
      score: null,
      summary: null,
      content: show.content.join('\n'),
      url: show.url,
      date: show.date ? new Date(show.date) : null,
      author: {
        connectOrCreate: {
          where: { name: show.author_name },
          create: {
            name: show.author_name,
            url: show.author_url,
            avatar: show.author_avatar,
          },
        },
      },
      publication: {
        connectOrCreate: { where: { name: vogue.name }, create: vogue },
      },
    }
  const name = `${show.brand} ${caps(show.season)}`

  // TODO Vogue will list the same collection twice (once under "Menswear" and
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
  const looks: Prisma.LookCreateWithoutShowInput[] = show.looks.map((look) => {
    const image: Prisma.ImageCreateWithoutLookInput = { url: look.src }
    return {
      number: look.number,
      image: { connectOrCreate: { where: { url: image.url }, create: image } },
    }
  })
  const brand: Prisma.BrandCreateInput = {
    name: show.brand,
    slug: slug(show.brand),
    description: null,
    tier: null,
    avatar: null,
    url: null,
  }

  const data: Prisma.ShowCreateInput = {
    ...etc,
    name,
    url: show.url,
    description: null,
    criticReviewSummary: null,
    consumerReviewSummary: null,
    date: show.date ? new Date(show.date) : null,
    reviews: review ? { create: review } : undefined,
    season: {
      connectOrCreate: {
        where: { name_year: { name: season.name, year: season.year } },
        create: season,
      },
    },
    collections: { connectOrCreate: { where: { name }, create: collection } },
    looks: { create: looks },
    brand: { connectOrCreate: { where: { name: brand.name }, create: brand } },
  }
  return data
}
