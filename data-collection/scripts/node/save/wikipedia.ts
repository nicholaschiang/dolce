// Script to save the data scraped via `python/spiders/wikipedia.py` to the
// Postgres database via the Prisma ORM for type safe data transformations.

import fs from 'fs'
import path from 'path'

import { type Prisma, type Publication, PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'
import ProgressBar from 'progress'

import example from './wikipedia/designer.json'

const DEBUG = false
const DRY_RUN = false
const PATH = '../../../../static/data/wikipedia.json'

type Designer = typeof example

const wikipedia: Prisma.PublicationCreateInput = {
  name: 'Wikipedia',
  avatar:
    'https://wikipedia.org/static/images/mobile/copyright/wikipedia-wordmark-en.svg',
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  console.log(`Creating publication...`)
  const publication = await prisma.publication.upsert({
    where: { name: wikipedia.name },
    create: wikipedia,
    update: wikipedia,
  })
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const raw = JSON.parse(json) as Designer[]
  console.log(`Parsing ${raw.length} designers...`)
  const designers = raw.map((row) => getData(row, publication))
  console.log(`Parsed ${designers.length} designers.`)
  const bar = new ProgressBar(
    'Saving Wikipedia designers... [:bar] :rate/s :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: designers.length,
    },
  )
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const designer of designers) {
    try {
      if (!DRY_RUN) await prisma.user.create({ data: designer })
      bar.tick()
    } catch (error) {
      console.error(
        `Error while saving designer:`,
        JSON.stringify(designer, null, 2),
      )
      console.error(error)
    }
  }
}

void save()

//////////////////////////////////////////////////////////////////

function strip(str: string) {
  return str.replace(/(?=\s)[^\r\n\t]/g, ' ').trim()
}

function getData(
  designer: Designer,
  publication: Publication,
): Prisma.UserCreateInput {
  const date = strip(designer.last_edited ?? '').replace(
    'This page was last edited on ',
    '',
  )
  const timestamp = date
    ? DateTime.fromFormat(date, `d MMMM yyyy, 'at' HH:mm`).toString()
    : null
  if (DEBUG) {
    console.log('Date:', date)
    console.log('Timestamp:', timestamp)
  }
  if (designer.title == null) {
    console.error('No title for designer:', designer)
  }
  const article: Prisma.ArticleCreateWithoutUserInput = {
    writtenAt: timestamp,
    url: designer.url,
    title: designer.title ?? designer.designer_name,
    content: designer.content,
    publication: { connect: { id: publication.id } },
  }
  const country: Prisma.CountryCreateWithoutDesignersInput = {
    name: designer.country_name,
  }
  // I intentionally do not address these import errors as they usually happen
  // due to duplicates in the data (e.g. someone changed their name and both
  // names appear in the list) or incorrect article links (e.g. multiple names
  // linked to the same article about the brand they made together).
  return {
    name: designer.designer_name,
    articles: {
      create: article,
      /*
       *connectOrCreate: {
       *  where: {
       *    publicationId_title: {
       *      publicationId: publication.id,
       *      title: article.title,
       *    },
       *  },
       *  create: article,
       *},
       */
    },
    country: {
      connectOrCreate: { where: { name: country.name }, create: country },
    },
  }
}
