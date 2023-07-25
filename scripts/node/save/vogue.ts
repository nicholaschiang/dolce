// Script to save the data scraped via `scripts/python/spiders/vogue.py` to the
// Postgres database via the Prisma ORM for type safe data transformations.

import fs from 'fs'
import path from 'path'

import { type Prisma, Sex, SeasonName, PrismaClient } from '@prisma/client'
import ProgressBar from 'progress'

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
    await prisma.show.create({ data: getData(show) })
    bar.tick()
  }
}

void save()

//////////////////////////////////////////////////////////////////

function caps(sentence: string): string {
  return sentence
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function getSeason(show: Show) {
  // e.g. "SPRING 2023 READY-TO-WEAR", "RESORT 2024"
  const [season, yr] = show.season.split(' ')
  let name: SeasonName
  switch (season) {
    case 'SPRING':
      name = SeasonName.SPRING
      break
    case 'RESORT':
      name = SeasonName.RESORT
      break
    case 'FALL':
      name = SeasonName.FALL
      break
    default:
      throw new Error(`Unknown season: ${season}`)
  }
  const year = Number(yr)
  if (Number.isNaN(year)) throw new Error(`Invalid year: ${year}`)
  return { name, year }
}

function getData(show: Show) {
  const season: Prisma.SeasonCreateInput = getSeason(show)
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
  let name = `${show.brand} ${caps(show.season)}`
  if (show.title.includes('Menswear')) name += ' Menswear'

  // TODO Vogue will list the same collection twice (once under "Menswear" and
  // again without "Menswear") if that collection is unisex. I can fix this by
  // looking for collections that have the same review content and other data,
  // and then merge those collections under the same unisex name.
  const collection: Prisma.CollectionCreateInput = {
    name,
    sex: show.title.includes('Menswear') ? Sex.MAN : Sex.WOMAN,
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
    description: null,
    tier: null,
    avatar: null,
    url: null,
  }
  const data: Prisma.ShowCreateInput = {
    name,
    url: show.url,
    description: null,
    criticReviewSummary: null,
    consumerReviewSummary: null,
    date: show.date ? new Date(show.date) : null,
    location: null,
    reviews: review ? { create: review } : undefined,
    season: {
      connectOrCreate: {
        where: { name_year: { name: season.name, year: season.year } },
        create: season,
      },
    },
    collections: { connectOrCreate: { where: { name }, create: collection } },
    looks: { create: looks },
    brands: { connectOrCreate: { where: { name: brand.name }, create: brand } },
  }
  return data
}
