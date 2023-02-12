import { Link, Outlet } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { Prisma } from '@prisma/client'
import { json } from '@remix-run/node'

import { ThemeSwitcher } from 'components/theme-switcher'

import { log } from 'log.server'

export type LoaderData = {
  models: Prisma.DMMF.Model[]
  enums: Prisma.DMMF.DatamodelEnum[]
}

export const loader: LoaderFunction = () => {
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
  return json<LoaderData>({ models, enums })
}

function Header() {
  return (
    <header className='relative shrink-0 border-b border-gray-200 bg-white/75 px-12 py-6 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/75'>
      <h1 className='text-xl leading-none'>
        <Link to='/' prefetch='intent'>
          nicholas.engineering
        </Link>
      </h1>
      <p className='mt-px text-sm leading-none text-gray-400 dark:text-gray-500'>
        a project by{' '}
        <a
          href='https://nicholaschiang.com'
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          nicholas chiang
        </a>
      </p>
      <div className='absolute inset-y-0 right-12 flex items-center'>
        <ThemeSwitcher />
      </div>
    </header>
  )
}

export default function LayoutPage() {
  return (
    <main className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header />
      <Outlet />
    </main>
  )
}
