import type { Dispatch, SetStateAction } from 'react'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { useCallback, useMemo } from 'react'
import type { LoaderFunction } from '@remix-run/node'
import { Prisma } from '@prisma/client'
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

export type LoaderData = {
  products: ProductItemProps[]
  models: Prisma.DMMF.Model[]
  enums: Prisma.DMMF.DatamodelEnum[]
}

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

  // the ui knows what type of filter select ux to show based on the field type:
  //
  // 1. given a data model (e.g. "Product"), each of the fields becomes an
  //    option in the initial "filter..." drop-down.
  //
  // 2. once a field has been selected:
  //
  //    - if the field is scalar, we show an input letting the user type in what
  //      value they want (e.g. "price is greater than ___")
  //      Ex: <IntInput />, <DecimalInput />, <StringInput />
  //
  //    - if the field is scalar but the dropdown option was specified, we query
  //      the database to get all the available options (e.g. we'll query the
  //      products table to get a list of all the possible prices and show those
  //      as menu options)
  //      Ex: <IntOption />, <StringOption />, <DecimalOption />
  //
  //    - if the field is an enum, we show a dropdown of all the possible enum
  //      values
  //      Ex: <LevelOption />, <TierOption />, <SeasonOption />
  //
  //    - if the field is an object (i.e. a nested model), we query that model's
  //      table to show a list of all the available options (e.g. we'll query
  //      the sizes table to show a list of all the possible sizes)
  //      Ex: <SizeOption />, <BrandOption />, <CountryOption />, <ShowOption />
  //
  // 3. we have a default "condition" for each field type ("is" for scalar and
  //    enum fields, "some" for object fields). if a user selects or inputs
  //    multiple options, those are then converted automatically ("in" for
  //    scalar and enum fields, "some" + "OR" for object fields).
  //
  //    users can also manually select which condition they would like to use.
  //    the options available change depending on the field type and the number
  //    of values selected.
  const { models, enums } = Prisma.dmmf.datamodel
  log.trace('got %d models %s', models.length, JSON.stringify(models, null, 2))
  log.trace('got %d enums %s', enums.length, JSON.stringify(enums, null, 2))

  return json<LoaderData>({ products, models, enums })
}

export default function ProductsPage() {
  const { products, models, enums } = useLoaderData<LoaderData>()
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
      <Filters
        model='Product'
        models={models}
        enums={enums}
        filters={filters}
        setFilters={setFilters}
      />
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
