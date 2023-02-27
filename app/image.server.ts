import { PassThrough } from 'stream'
import type { Readable } from 'stream'
import { createHash } from 'crypto'
import fs from 'fs'
import fsp from 'fs/promises'
import https from 'https'
import path from 'path'

import type { LoaderFunction, Request as NodeRequest } from '@remix-run/node'
import {
  Response as NodeResponse,
  writeReadableStreamToWritable,
} from '@remix-run/node'
import type { FitEnum } from 'sharp'
import sharp from 'sharp'

import { log } from 'log.server'

const badImageBase64 =
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function badImageResponse() {
  const buffer = Buffer.from(badImageBase64, 'base64')
  return new Response(buffer, {
    status: 500,
    headers: {
      'Cache-Control': 'max-age=0',
      'Content-Type': 'image/gif;base64',
      'Content-Length': buffer.length.toFixed(0),
    },
  })
}

function getIntOrNull(value: string | null) {
  return value === null ? null : Number.parseInt(value, 10)
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)

  const src = url.searchParams.get('src')
  if (!src) return badImageResponse()
  log.debug('optimizing image... %s', src)

  const width = getIntOrNull(url.searchParams.get('width'))
  const height = getIntOrNull(url.searchParams.get('height'))
  const fit = (url.searchParams.get('fit') as keyof FitEnum) || 'cover'

  const hash = createHash('sha256')
  hash.update('v1')
  hash.update(request.method)
  hash.update(request.url)
  hash.update(width?.toString() || '0')
  hash.update(height?.toString() || '0')
  hash.update(fit)
  const key = hash.digest('hex')
  const cachedFile = path.resolve(path.join('.cache/images', `${key}.webp`))

  try {
    const exists = await fsp
      .stat(cachedFile)
      .then((s) => s.isFile())
      .catch(() => false)

    if (exists) {
      const fileStream = fs.createReadStream(cachedFile)

      return new NodeResponse(fileStream, {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }) as unknown as Response
    }
    log.debug('cache skipped for: %s', cachedFile)
  } catch (error) {
    log.error(error)
  }

  try {
    let imageBody: Readable | undefined
    let status = 200

    if (src.startsWith('/') && (src.length === 1 || src[1] !== '/')) {
      log.debug('fetching local image: %s', src.slice(1))
      imageBody = fs.createReadStream(path.resolve('public', src.slice(1)))
    } else {
      log.debug('fetching remote image: %s', src.toString())
      const imgRequest = new Request(src.toString()) as unknown as NodeRequest
      imgRequest.agent = new https.Agent({ rejectUnauthorized: false })
      const imageResponse = await fetch(imgRequest as unknown as Request)
      log.debug('fetched remote image status: %d', imageResponse.status)
      status = imageResponse.status
      if (imageResponse.body) {
        const passThrough = new PassThrough()
        imageBody = passThrough
        await writeReadableStreamToWritable(imageResponse.body, passThrough)
      }
    }

    if (!imageBody) return badImageResponse()

    const sharpInstance = sharp()
    sharpInstance.on('error', (error) => log.error(error))

    if (width || height) sharpInstance.resize(width, height, { fit })
    sharpInstance.webp({ effort: 6 })

    const imageManipulationStream = imageBody.pipe(sharpInstance)

    await fsp
      .mkdir(path.dirname(cachedFile), { recursive: true })
      .catch(() => {})
    const cacheFileStream = fs.createWriteStream(cachedFile)

    await new Promise<void>((resolve) => {
      imageManipulationStream.pipe(cacheFileStream)
      imageManipulationStream.on('end', () => {
        resolve()
        imageBody?.destroy()
      })
      imageManipulationStream.on('error', (error: Error) => {
        log.error('error manipulating image: %s', error.message)
        imageBody?.destroy()
        void fsp.rm(cachedFile).catch(() => {})
      })
    })

    log.debug('streaming cached response: %s', cachedFile)
    const fileStream = fs.createReadStream(cachedFile)

    return new NodeResponse(fileStream, {
      status,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }) as unknown as Response
  } catch (error) {
    log.error(error)
    return badImageResponse()
  }
}
