import {
  ArrowTopRightIcon,
  CardStackIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import { Link } from '@remix-run/react'
import type { FunctionComponent } from 'react'

import { ThemeSwitcher } from 'components/theme-switcher'

export const config = { runtime: 'edge' }

export default function IndexPage() {
  return (
    <main className='flex min-h-screen w-screen items-center justify-center'>
      <div className='fixed top-8 right-8'>
        <ThemeSwitcher />
      </div>
      <section>
        <Milestone
          start={new Date(2023, 3, 18)}
          title='/life'
          subtitle='a graphical depiction'
          url='/life/life.pdf'
          icon={PersonIcon}
          openInNew
        />
        <Milestone
          start={new Date(2023, 0, 2)}
          title='/products'
          subtitle='a fashion archive'
          url='/products'
          icon={CardStackIcon}
        />
        <Milestone
          start={new Date(2023, 0, 1)}
          title='nicholas.engineering'
          subtitle='yet another portfolio'
          url='https://github.com/nicholaschiang/site'
          openInNew
        />
        <Milestone
          start={new Date(2022, 5, 1)}
          title='numbersstation.ai'
          subtitle='a dbt generator'
          url='https://numbersstation.ai'
          openInNew
        />
        <Milestone
          start={new Date(2022, 2, 1)}
          end={new Date(2022, 7, 1)}
          title='tweetscape.co'
          subtitle='a twitter client'
          url='https://github.com/rooteco/tweetscape'
          openInNew
        />
        <Milestone
          start={new Date(2021, 3, 1)}
          end={new Date(2021, 11, 1)}
          title='readhammock.com'
          subtitle='a newsletter reader'
          url='https://github.com/nicholaschiang/hammock'
          openInNew
        />
        <Milestone
          start={new Date(2019, 1, 1)}
          end={new Date(2022, 6, 1)}
          title='tutorbook.org'
          subtitle='a booking platform'
          url='https://github.com/tutorbookapp/tutorbook'
          openInNew
        />
        <Milestone
          start={new Date(2018, 8, 1)}
          end={new Date(2019, 4, 1)}
          title='sing.stanford.edu'
          subtitle='some ml research'
          url='https://dl.acm.org/doi/10.1145/3391906?cid=99659274049'
          openInNew
        />
      </section>
    </main>
  )
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'numeric',
  year: 'numeric',
}

interface MilestoneProps {
  start: Date
  end?: Date
  title: string
  subtitle: string
  url?: string
  icon?: FunctionComponent<IconProps>
  openInNew?: boolean
}

function Milestone({
  start,
  end,
  title,
  subtitle,
  url,
  icon,
  openInNew,
}: MilestoneProps) {
  const Icon = icon ?? ArrowTopRightIcon
  return (
    <article className='before:content-[" "] relative m-12 text-lg leading-none before:absolute before:-left-6.5 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-300 after:absolute after:-left-[calc(1.5rem_+_0.5px)] after:top-1/2 after:h-[calc(100%_+_3rem)] after:border-l after:border-gray-300 last:after:hidden dark:before:bg-gray-100 dark:after:border-gray-100'>
      <p className='text-xs lowercase text-gray-900/50 dark:text-gray-100/50'>
        {start.toLocaleString(undefined, DATE_FORMAT)}
        {end ? `–${end.toLocaleString(undefined, DATE_FORMAT)}` : ''}
      </p>
      <h1 className='my-2 font-semibold'>
        {!url && title}
        {url && !openInNew && (
          <Link
            to={url}
            prefetch='intent'
            className='items-top link group flex underline'
          >
            {title}
            <Icon className='ml-1 inline-block h-4 w-4 text-gray-400 dark:text-gray-500' />
          </Link>
        )}
        {url && openInNew && (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='items-top link group flex underline'
          >
            {title}
            <Icon className='ml-1 inline-block h-4 w-4 text-gray-400 dark:text-gray-500' />
          </a>
        )}
      </h1>
      <h2>{subtitle}</h2>
    </article>
  )
}
