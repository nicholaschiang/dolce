import { Outlet } from '@remix-run/react'
import { Prisma } from '@prisma/client'

import * as Header from 'components/header'

import { log } from 'log.server'

export function loader() {
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
  return { models, enums }
}

export default function LayoutPage() {
  return (
    <main className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header.Root>
        <Header.Content />
      </Header.Root>
      <Outlet />
    </main>
  )
}
