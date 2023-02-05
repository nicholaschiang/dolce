import ThemeSwitcher from 'components/theme-switcher'

import ArrowUpRight from 'icons/arrow-up-right'

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
}

function Milestone({ start, end, title, subtitle, url }: MilestoneProps) {
  return (
    <article className='before:content-[" "] relative m-12 text-lg leading-none before:absolute before:-left-6.5 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-300 after:absolute after:-left-[calc(1.5rem_+_0.5px)] after:top-1/2 after:h-[calc(100%_+_3rem)] after:border-l after:border-gray-300 dark:before:bg-gray-100 dark:after:border-gray-100'>
      <p className='text-xs lowercase text-gray-900/50 dark:text-gray-100/50'>
        {start.toLocaleString(undefined, DATE_FORMAT)}
        {end ? `–${end.toLocaleString(undefined, DATE_FORMAT)}` : ''}
      </p>
      <h1 className='my-2 font-semibold'>
        {!url && title}
        {!!url && (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='items-top flex underline decoration-gray-900/40 transition-colors hover:decoration-gray-900 dark:decoration-gray-100/40 dark:hover:decoration-gray-100'
          >
            {title}
            <ArrowUpRight className='inline-block h-4 w-4 text-gray-400 dark:text-gray-500' />
          </a>
        )}
      </h1>
      <h2>{subtitle}</h2>
    </article>
  )
}

export default function Index() {
  return (
    <main className='flex min-h-screen w-screen items-end justify-center'>
      <div className='fixed top-8 right-8'>
        <ThemeSwitcher />
      </div>
      <section>
        <Milestone
          start={new Date(2023, 0, 1)}
          title='nicholas.engineering'
          subtitle='yet another portfolio'
          url='https://github.com/nicholaschiang/site'
        />
        <Milestone
          start={new Date(2022, 5, 1)}
          title='numbersstation.ai'
          subtitle='a dbt generator'
          url='https://numbersstation.ai'
        />
        <Milestone
          start={new Date(2022, 2, 1)}
          end={new Date(2022, 7, 1)}
          title='tweetscape.co'
          subtitle='a twitter client'
          url='https://github.com/rooteco/tweetscape'
        />
        <Milestone
          start={new Date(2021, 3, 1)}
          end={new Date(2021, 11, 1)}
          title='readhammock.com'
          subtitle='a newsletter reader'
          url='https://github.com/nicholaschiang/hammock'
        />
        <Milestone
          start={new Date(2019, 1, 1)}
          end={new Date(2022, 6, 1)}
          title='tutorbook.org'
          subtitle='a booking platform'
          url='https://github.com/tutorbookapp/tutorbook'
        />
        <Milestone
          start={new Date(2018, 8, 1)}
          end={new Date(2019, 4, 1)}
          title='sing.stanford.edu'
          subtitle='some ml research'
          url='https://dl.acm.org/doi/10.1145/3391906?cid=99659274049'
        />
      </section>
    </main>
  )
}
