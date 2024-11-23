// Script to save posts from Instagram's saved posts API to our database.
//
// First, download the JSON file from Instagram's saved posts API. To do this,
// you can open the collection on Instagram (e.g. https://www.instagram.com/
// niicholaschiiang/saved/drip/17925844928243634/), open the network tab, scroll
// down to trigger a fetch, and then "copy as cURL" the request. Then, run that
// cURL to get the resulting JSON file.
//
// Then, run this script with that JSON file to save those posts to our db.

import fs from 'fs'
import path from 'path'

import { type Prisma, PrismaClient } from '@prisma/client'
import ProgressBar from 'progress'

import savedPostsType from './posts.json'

type SavedPosts = typeof savedPostsType
type SavedPost = SavedPosts['items'][number]

const DEBUG = false
const DRY_RUN = false
const PATH = './posts.json'

// The ID of the user who should be marked as the author of the imported posts.
const AUTHOR_ID = 166

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const savedPosts = JSON.parse(json) as SavedPosts
  log(`Parsing ${savedPosts.items.length} saved posts...`)
  const data = savedPosts.items.map(getData)
  log(`Parsed ${data.length} shows.`)
  let index = Number(process.argv[2])
  if (Number.isNaN(index)) index = 0
  const final = data.slice(index)
  log(`Starting at index ${index}, saving ${final.length} posts...`)
  const bar = new ProgressBar(
    'Saving posts... [:bar] :rate/sps :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: final.length,
    },
  )
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const post of final) {
    try {
      if (!DRY_RUN)
        await prisma.post.upsert({
          where: { url: post.url },
          create: post,
          update: post,
        })
      bar.tick()
    } catch (error) {
      console.error(`Error while saving post:`, JSON.stringify(post))
      console.error(error)
    }
  }
}

void save()

//////////////////////////////////////////////////////////////////

function log(...args: Parameters<typeof console.log>) {
  if (DEBUG) console.log(...args)
}

function getData(post: SavedPost) {
  const image = post.media.image_versions2.candidates[0]
  const data = {
    url: `https://instagram.com/p/${post.media.code}`,
    description: post.media.caption?.text,
    author: { connect: { id: AUTHOR_ID } },
    // TODO support different media types (e.g. import every image in a carousel
    // and import videos from reel media types).
    images: {
      connectOrCreate: {
        where: { url: image.url },
        create: { url: image.url, width: image.width, height: image.height },
      },
    },
    // TODO import styles from the media's accessibility caption.
    items: undefined,
    // TODO import products from the product_tags.
    products: undefined,
  } satisfies Prisma.PostCreateInput
  return data
}
