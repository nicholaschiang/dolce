import type { Dispatch, SetStateAction } from 'react'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { useCallback, useMemo } from 'react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { Filters } from 'components/filters'

import {
  filterToPrismaWhere,
  filterToSearchParam,
  searchParamToFilter,
} from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

const FILTER_PARAM = 'f'
const JOIN_PARAM = 'j'

type ProductItemProps = {
  id: number
  name: string
  imageUrl?: string
  msrp?: number
}

function ProductItem({ id, name, imageUrl, msrp }: ProductItemProps) {
  return (
    <li className='shrink-0 grow-0 basis-2/12'>
      <div className='relative m-2'>
        <div className='absolute w-full'>
          <img
            className='absolute top-0 w-full rounded-md'
            src={imageUrl}
            alt={name}
          />
        </div>
        <Link to={`/products/${id}`}>
          <div className='relative mb-2 rounded-md pt-5/4' />
          <h2 className='leading-none'>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  )
}

export type LoaderData = ProductItemProps[]

// users can control prisma queries via url search parameters.
// Ex: /products?f=price:gt:100&f=price:lt:200&j=OR
// ... will return products with a price between 100 and 200.
export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const filters = searchParams.getAll(FILTER_PARAM).map(searchParamToFilter)
  let join = searchParams.get(JOIN_PARAM)
  if (!join || !['AND', 'OR', 'NOT'].includes(join)) join = 'AND'
  log.debug('getting products... %o', filters)
  const products = (
    await prisma.product.findMany({
      include: { images: true },
      where: { [join]: filters.map(filterToPrismaWhere) },
    })
  ).map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.images[0]?.url,
    // real users don't care about cents. most reputable brands won't include
    // cents in their prices anyway. prices that do include cents are usually
    // intended to be misleading (e.g. $69.70 instead of $70).
    msrp: product.msrp ? Math.round(Number(product.msrp)) : undefined,
  }))
  log.debug('got %d products', products.length)
  return json<LoaderData>(products)
}

export default function ProductsPage() {
  const products = useLoaderData<LoaderData>()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo<Filter[]>(
    () => searchParams.getAll(FILTER_PARAM).map(searchParamToFilter),
    [searchParams],
  )
  const setFilters = useCallback<Dispatch<SetStateAction<Filter[]>>>(
    (action: SetStateAction<Filter[]>) => {
      setSearchParams((prevSearchParams) => {
        let nextFilters: Filter[]
        if (typeof action === 'function') {
          const prevFilters = prevSearchParams
            .getAll(FILTER_PARAM)
            .map(searchParamToFilter)
          nextFilters = action(prevFilters)
        } else {
          nextFilters = action
        }
        const nextSearchParams = new URLSearchParams(prevSearchParams)
        nextSearchParams.delete(FILTER_PARAM)
        nextFilters.forEach((filter) =>
          nextSearchParams.append(FILTER_PARAM, filterToSearchParam(filter)),
        )
        return nextSearchParams
      })
    },
    [setSearchParams],
  )
  return (
    <>
      <Filters modelName='Product' filters={filters} setFilters={setFilters} />
      <div className='h-full flex-1 overflow-y-auto overflow-x-hidden px-12 py-6'>
        <ol className='-m-2 flex flex-wrap'>
          {products.map((product) => (
            <ProductItem {...product} key={product.id} />
          ))}
        </ol>
      </div>
    </>
  )
}
