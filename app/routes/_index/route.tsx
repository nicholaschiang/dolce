import { Location } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { scaleLinear } from 'd3-scale'
import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from 'react-simple-maps'

import { prisma } from 'db.server'

import geography from './geography.json'
import { Header } from './header'

export async function loader() {
  const shows = await prisma.show.groupBy({
    by: ['location'],
    _count: true,
    _max: { id: true },
    where: { location: { not: Location.PARIS } },
  })
  return shows
}

export default function IndexPage() {
  return (
    <>
      <Header />
      <Map />
    </>
  )
}

const locations: Record<Location, { lng: number; lat: number }> = {
  NEW_YORK: { lng: -74.006, lat: 40.7128 },
  LONDON: { lng: -0.1278, lat: 51.5074 },
  MILAN: { lng: 9.19, lat: 45.4642 },
  PARIS: { lng: 2.3522, lat: 48.8566 },
  TOKYO: { lng: 139.6917, lat: 35.6895 },
  BERLIN: { lng: 13.405, lat: 52.52 },
  FLORENCE: { lng: 11.2558, lat: 43.7696 },
  LOS_ANGELES: { lng: -118.2437, lat: 34.0522 },
  MADRID: { lng: -3.7038, lat: 40.4168 },
  COPENHAGEN: { lng: 12.5683, lat: 55.6761 },
  SHANGHAI: { lng: 121.4737, lat: 31.2304 },
  AUSTRALIA: { lng: 133.7751, lat: -25.2744 },
  STOCKHOLM: { lng: 18.0686, lat: 59.3293 },
  MEXICO: { lng: -99.1332, lat: 19.4326 },
  MEXICO_CITY: { lng: -99.1332, lat: 19.4326 },
  KIEV: { lng: 30.5234, lat: 50.4501 },
  TBILISI: { lng: 44.793, lat: 41.7151 },
  SEOUL: { lng: 126.978, lat: 37.5665 },
  RUSSIA: { lng: 105.3188, lat: 61.524 },
  UKRAINE: { lng: 31.1656, lat: 48.3794 },
  SAO_PAOLO: { lng: -46.6333, lat: -23.5505 },
  BRIDAL: { lng: -46.6333, lat: -23.5505 },
}

function Map() {
  const shows = useLoaderData<typeof loader>()
  const max = shows.sort((a, b) => b._count - a._count)?.[0]?._count
  const scale = useMemo(
    () => scaleLinear().domain([0, max]).range([0, 10]),
    [max],
  )
  return (
    <div className='fixed inset-0 flex justify-center items-center p-6'>
      <ComposableMap
        className='object-scale-down max-w-full max-h-full'
        projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
      >
        <Sphere
          id='sphere'
          fill='transparent'
          stroke='inherit'
          className='stroke-gray-200 dark:stroke-gray-800'
          strokeWidth={0.5}
        />
        <Graticule
          className='stroke-gray-200 dark:stroke-gray-800'
          strokeWidth={0.5}
        />
        <Geographies geography={geography}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className='fill-gray-900 dark:fill-gray-100'
              />
            ))
          }
        </Geographies>
        {Object.entries(locations).map(([location, { lng, lat }]) => {
          const show = shows.find((s) => s.location === location)
          const radius = scale(show?._count ?? 0)
          return (
            <Marker key={location} coordinates={[lng, lat]}>
              <circle className='fill-teal-500 opacity-50' r={radius} />
              <circle className='fill-teal-500' r={2} />
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}
