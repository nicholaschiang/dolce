import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { ExternalLink } from 'lucide-react'
import { type PropsWithChildren } from 'react'

import { Button } from 'atoms/Button'
import { Empty } from 'atoms/Empty'
import { Textarea } from 'atoms/Textarea'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { cn } from 'utils/cn'

export async function loader({ params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      video: true,
      season: true,
      brands: true,
      reviews: { include: { author: true, publication: true } },
      looks: { include: { image: true } },
    },
  })
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  show.looks = show.looks.sort((a, b) => a.number - b.number)
  return show
}

export default function ShowPage() {
  return (
    <main className='h-full flex-1 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5 gap-6 px-6'>
      <About className='col-span-3 py-6' />
      <Looks className='col-span-2 py-6' />
    </main>
  )
}

function About({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto grid gap-10', className)}>
      <div className='grid gap-2'>
        <video
          className='aspect-video w-full bg-gray-100 dark:bg-gray-800'
          controls
          autoPlay
          playsInline
          muted
        >
          <source src={show.video.url} type={show.video.mimeType} />
          Download the <a href={show.video.url}>MP4</a> video.
        </video>
        <div className='flex gap-2'>
          <div className='flex-none w-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden'>
            <img src={show.looks[0].image.url} alt='' />
          </div>
          <article className='flex-1 bg-gray-100 dark:bg-gray-800 text-center px-6 flex flex-col'>
            <h1 className='font-serif font-bold text-5xl mb-1 mt-8'>
              {show.brands.map((brand) => brand.name).join(', ')}
            </h1>
            <h2 className='uppercase mb-6 text-sm'>
              {show.season.name.replace('_', '-')} {show.season.year}{' '}
              READY-TO-WEAR
            </h2>
            <ul className='grid grid-cols-2 gap-2 mt-auto'>
              <Score value={0.72} label='Critic Score' count='339 Reviews' />
              <Score
                value={0.94}
                label='Consumer Score'
                count='10,000+ Ratings'
              />
            </ul>
          </article>
        </div>
      </div>
      <Section header='What to know'>
        <Subheader>Critics Consensus</Subheader>
        {show.criticReviewSummary ? (
          <p className='mb-2'>{show.criticReviewSummary}</p>
        ) : (
          <Empty className='mb-2'>
            There is no Critics Consensus because there are not enough reviews
            yet.
          </Empty>
        )}
        <Subheader>Consumers Say</Subheader>
        {show.consumerReviewSummary ? (
          <p>{show.consumerReviewSummary}</p>
        ) : (
          <Empty>
            There is no Consumer Summary because there are not enough reviews
            yet.
          </Empty>
        )}
      </Section>
      <Section header='Collection info'>
        <article>{show.description}</article>
      </Section>
      <Section header='Rate and review'>
        <div className='mt-2 grid gap-2'>
          <Textarea placeholder='What did you think of the collection? (optional)' />
          <Button>Submit</Button>
        </div>
      </Section>
      <Section header={`Critic reviews for ${show.name}`}>
        <ol className='mt-2 grid gap-4'>
          {show.reviews
            .filter((r) => r.publication != null && r.url != null)
            .map((review) => (
              <li key={review.id}>
                <Review
                  author={review.author}
                  publication={review.publication?.name as string}
                  url={review.url as string}
                  content={review.content}
                />
              </li>
            ))}
        </ol>
      </Section>
    </div>
  )
}

function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
      <ol className='grid grid-cols-2 gap-x-2 gap-y-6'>
        {show.looks.map((look) => (
          <li key={look.id}>
            <img src={look.image.url} alt={`Look ${look.number}`} />
            <p className='mt-0.5 text-sm'>Look {look.number}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

type ReviewProps = {
  author: { name: string; url: string | null }
  publication: string
  url: string
  content: string
}

function Review({ author, publication, url, content }: ReviewProps) {
  return (
    <figure className='flex-none bg-gray-100 dark:bg-gray-800 overflow-hidden pb-4'>
      <figcaption className='mt-8 text-center'>
        <cite className='text-lg underline underline-offset-4 decoration-2 decoration-gray-300 dark:decoration-gray-600'>
          <span className='text-gray-500'>By </span>
          {author.url != null && (
            <a href={author.url} target='_blank' rel='noopener noreferrer'>
              {author.name}
            </a>
          )}
          {author.url == null && <span>{author.name}</span>}
          <span className='text-gray-500'> for </span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2'
          >
            {publication}
            <ExternalLink className='w-4 h-4' />
          </a>
        </cite>
      </figcaption>
      <blockquote
        className='prose prose-zinc dark:prose-invert p-6 m-auto'
        cite={url}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </figure>
  )
}

type ScoreProps = { value: number; label: string; count: string }

function Score({ value, label, count }: ScoreProps) {
  let img
  if (value > 0.9) img = '90'
  else if (value > 0.8) img = '80'
  else if (value > 0.7) img = '70'
  else if (value > 0.6) img = '60'
  else if (value > 0.5) img = '50'
  else img = '40'
  return (
    <li className='flex gap-2'>
      <img className='flex-none w-20' src={`/flowers/${img}.png`} alt='' />
      <div>
        <h2 className='text-5xl font-black font-serif'>{value * 100}%</h2>
        <p className='text-xs font-semibold uppercase'>{label}</p>
        <p className='text-xs'>{count}</p>
      </div>
    </li>
  )
}

function Section({ header, children }: PropsWithChildren<{ header: string }>) {
  return (
    <section className='grid gap-2'>
      <h1 className='border-l-2 border-primary pl-1.5 font-medium text-base uppercase'>
        {header}
      </h1>
      {children}
    </section>
  )
}

function Subheader({ children }: { children: string }) {
  return <h2 className='font-semibold'>{children}</h2>
}
