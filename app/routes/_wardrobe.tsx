import { Outlet, Link, useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs, type SerializeFrom } from '@vercel/remix'

import { Avatar } from 'components/avatar'
import { Header } from 'components/header'
import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
} from 'components/layout'
import { badgeVariants } from 'components/ui/badge'

import { cn } from 'utils/cn'
import { OWN_SET_NAME } from 'utils/set'
import { getShowSeason } from 'utils/show'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

export async function loader({ request }: DataFunctionArgs) {
  const userId = await getUserId(request)
  if (userId == null) return []
  const looks = await prisma.look.findMany({
    where: { sets: { some: { name: OWN_SET_NAME, authorId: userId } } },
    include: {
      author: true,
      images: true,
      sets: { include: { author: true } },
      show: { include: { season: true, brand: true } },
    },
  })
  return looks
}

export default function WardrobePage() {
  return (
    <Layout className='h-auto fixed inset-0'>
      <LayoutLeft>
        <Content />
      </LayoutLeft>
      <LayoutDivider />
      <LayoutRight className='flex flex-col'>
        <WardrobeHeader />
        <Looks />
      </LayoutRight>
    </Layout>
  )
}

function Content() {
  return (
    <main className='h-full flex flex-col overflow-hidden'>
      <Header className='flex-none' />
      <Outlet />
    </main>
  )
}

function WardrobeHeader() {
  return (
    <header className='p-3 border-b border-gray-200 dark:border-gray-800'>
      <h2 className='leading-none'>Your wardrobe</h2>
      <p className='text-gray-400 dark:text-gray-500'>
        Add products and looks to your wardrobe
      </p>
    </header>
  )
}

function Looks() {
  const looks = useLoaderData<typeof loader>()
  return (
    <div className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ul className='grid grid-cols-2 gap-2 p-2'>
        {looks.map((look) => (
          <LookItem key={look.id} look={look} />
        ))}
      </ul>
    </div>
  )
}

type Look = SerializeFrom<typeof loader>[number]

function LookItem({ look }: { look: Look }) {
  const username = look.author?.username ?? look.show?.brand?.slug
  const description = look.show
    ? `${getShowSeason(look.show)} Look ${look.number}`
    : `Look ${look.number}`
  return (
    <li className='rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs'>
      <div className='p-2 flex items-center gap-1'>
        <Avatar
          className='h-6 w-6 text-3xs'
          src={look.author ?? look.show?.brand}
        />
        <strong className='font-medium'>{username}</strong>
      </div>
      <div className='w-full aspect-person bg-gray-100 dark:bg-gray-900'>
        <img
          className='w-full h-full object-cover'
          src={look.images[0].url}
          alt=''
        />
      </div>
      <div className='p-2 flex flex-col gap-2'>
        <p className='truncate'>
          <strong className='font-medium'>{username}</strong> {description}
        </p>
        <ul className='flex flex-wrap gap-1'>
          {look.sets.map((set) => (
            <SetItem key={set.id} set={set} />
          ))}
        </ul>
      </div>
    </li>
  )
}

type Set = SerializeFrom<typeof loader>[number]['sets'][number]

function SetItem({ set }: { set: Set }) {
  return (
    <Link
      to={`/${set.author.username}/sets/${set.id}`}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(badgeVariants({ variant: 'outline' }), 'gap-1')}
    >
      <div className='rounded-full w-2 h-2 bg-violet-600' />
      <span>{set.name}</span>
    </Link>
  )
}
