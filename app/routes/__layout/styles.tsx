import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import type { Style } from '@prisma/client'
import { json } from '@remix-run/node'

import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Style[]

export const loader: LoaderFunction = async () => {
  log.debug('getting styles...')
  const styles = await prisma.style.findMany()
  log.debug('got %d styles', styles.length)
  return json<LoaderData>(styles)
}

export default function StylesPage() {
  const styles = useLoaderData<LoaderData>()
  return (
    <ul>
      {styles.map((style) => (
        <li key={style.id}>
          <Link to={`/styles/${style.id}`}>{style.name}</Link>
        </li>
      ))}
    </ul>
  )
}
