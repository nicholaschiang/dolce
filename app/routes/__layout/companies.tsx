import type { Company } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Company[]

export const loader: LoaderFunction = async () => {
  log.debug('getting companies...')
  const companies = await prisma.company.findMany()
  log.debug('got %d companies', companies.length)
  return json<LoaderData>(companies)
}
