import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, type SerializeFrom } from '@vercel/remix'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { type PropsWithChildren, useMemo } from 'react'

import { Empty } from 'components/empty'
import { ExternalLink } from 'components/external-link'
import { buttonVariants } from 'components/ui/button'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { type Handle } from 'root'
import { cn } from 'utils/cn'

export const handle: Handle = {
  breadcrumb: (match) => (
    <Link to={`/shows/${match.params.showId as string}`}>
      {(match.data as SerializeFrom<typeof loader>).name}
    </Link>
  ),
}

type Score = {
  positiveCount: number
  negativeCount: number
  neutralCount: number
  totalCount: number
}
type Scores = { critic: Score; consumer: Score }

function sanityCheck(score: Score, name: string): void {
  const sum = score.positiveCount + score.negativeCount + score.neutralCount
  if (sum !== score.totalCount) {
    const error =
      `${name} total (${score.totalCount}) did not match sum ` +
      `(${score.positiveCount} + ${score.negativeCount} + ` +
      `${score.neutralCount} = ${sum})`
    throw new Error(error)
  }
}

async function getScores(showId: number): Promise<Scores> {
  const [total, positive, neutral, negative] = await Promise.all([
    prisma.review.count({
      where: { showId },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { gt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { equals: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
    prisma.review.count({
      where: { showId, score: { lt: 0.5 } },
      select: { _all: true, publicationId: true },
    }),
  ])
  const scores = {
    critic: {
      positiveCount: positive.publicationId,
      negativeCount: negative.publicationId,
      neutralCount: neutral.publicationId,
      totalCount: total.publicationId,
    },
    consumer: {
      /* eslint-disable no-underscore-dangle */
      positiveCount: positive._all - positive.publicationId,
      negativeCount: negative._all - negative.publicationId,
      neutralCount: neutral._all - neutral.publicationId,
      totalCount: total._all - total.publicationId,
      /* eslint-enable no-underscore-dangle */
    },
  }
  sanityCheck(scores.critic, 'Critic Score')
  sanityCheck(scores.consumer, 'Consumer Score')
  return scores
}

export async function loader({ params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const [show, scores] = await Promise.all([
    prisma.show.findUnique({
      where: { id: showId },
      include: {
        video: true,
        season: true,
        brands: true,
        collections: {
          include: { links: { include: { brand: true, retailer: true } } },
        },
        reviews: { include: { author: true, publication: true } },
        looks: { include: { image: true }, orderBy: { number: 'asc' } },
      },
    }),
    getScores(showId),
  ])
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  return { ...show, scores }
}

export default function ShowPage() {
  return (
    <main className='fixed inset-0 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5 gap-6 px-6'>
      <About className='col-span-3 pb-6 pt-16' />
      <Looks className='col-span-2 pb-6 pt-16' />
    </main>
  )
}

function Looks({ className }: { className: string }) {
  const show = useLoaderData<typeof loader>()
  return (
    <div className={cn('overflow-auto', className)}>
      <ol className='grid grid-cols-2 gap-x-2 gap-y-6'>
        {show.looks.map((look) => (
          <li key={look.id}>
            <div className='bg-gray-100 dark:bg-gray-800 aspect-person'>
              <img
                className='object-cover h-full'
                src={look.image.url}
                alt=''
              />
            </div>
            <p className='mt-0.5 text-sm'>Look {look.number}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function About({ className }: { className: string }) {
  return (
    <div className={cn('overflow-auto grid gap-10', className)}>
      <Header />
      <WhatToKnow />
      <WhereToBuy />
      <ShowInfo />
      <Reviews />
    </div>
  )
}

function Header() {
  const show = useLoaderData<typeof loader>()
  return (
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
        <div className='flex-none w-40 bg-gray-100 dark:bg-gray-800 h-0 min-h-full'>
          <img
            className='object-cover h-full'
            src={show.looks[0].image.url}
            alt=''
          />
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
            <ScoreItem score={show.scores.critic} name='Critic Score' />
            <ScoreItem score={show.scores.consumer} name='Consumer Score' />
          </ul>
        </article>
      </div>
    </div>
  )
}

function WhatToKnow() {
  const show = useLoaderData<typeof loader>()
  return (
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
          There is no Consumer Summary because there are not enough reviews yet.
        </Empty>
      )}
    </Section>
  )
}

function WhereToBuy() {
  const show = useLoaderData<typeof loader>()
  const links = show.collections.map((collection) => collection.links).flat()
  const brands = show.brands.filter((brand) => brand.url)
  return (
    <Section header='Where to buy'>
      {links.length === 0 && (
        <Empty className='mt-2'>
          <p>
            There are no direct links to this collection on retailer or brand
            websites.
          </p>
          {brands.length > 0 && (
            <p>
              You can try browsing the{' '}
              {brands.map((brand, index) => (
                <span>
                  {index !== 0 && ', '}
                  <ExternalLink href={brand.url ?? ''}>
                    {brand.name}
                  </ExternalLink>
                </span>
              ))}{' '}
              website to find these items.
            </p>
          )}
        </Empty>
      )}
      {links.length > 0 && (
        <ul className='mt-2 flex gap-2'>
          {links.map((link) => (
            <li key={link.id}>
              <BuyLink
                avatar={(link.brand ?? link.retailer)?.avatar}
                alt={(link.brand ?? link.retailer ?? show)?.name}
                url={link.url}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function BuyLink({
  avatar,
  alt,
  url,
}: {
  avatar?: string | null
  alt: string
  url: string
}) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(buttonVariants({ variant: 'outline' }), 'h-auto')}
    >
      {avatar != null && <img src={avatar} alt={alt} />}
      {avatar == null && alt}
    </a>
  )
}

function ShowInfo() {
  const show = useLoaderData<typeof loader>()
  return (
    <Section header='Show info'>
      <article>{show.description}</article>
      <dl className='mt-2'>
        <InfoItem label='Date'>
          {new Date(show.date).toLocaleDateString(undefined, {
            dateStyle: 'long',
          })}
        </InfoItem>
        <InfoItem label='Location'>{show.location}</InfoItem>
        <InfoItem label='Looks'>{show.looks.length}</InfoItem>
        <InfoItem
          label={show.brands.length === 1 ? 'Brand' : 'Brands'}
          className='inline-flex gap-1'
        >
          {show.brands.map((brand) =>
            brand.url ? (
              <ExternalLink href={brand.url}>{brand.name}</ExternalLink>
            ) : (
              <span>{brand.name}</span>
            ),
          )}
        </InfoItem>
        <InfoItem label='URL'>
          <ExternalLink href={show.url}>
            {new URL(show.url).hostname}
          </ExternalLink>
        </InfoItem>
      </dl>
    </Section>
  )
}

function InfoItem({
  label,
  className,
  children,
}: PropsWithChildren<{ label: string; className?: string }>) {
  return (
    <div className='flex gap-1 items-center'>
      <dt className='flex-none font-semibold'>{label}:</dt>
      <dd className={cn('w-0 flex-1 truncate', className)}>{children}</dd>
    </div>
  )
}

function Reviews() {
  const show = useLoaderData<typeof loader>()
  return (
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
            <ExternalLinkIcon className='w-4 h-4' />
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

type ScoreItemProps = { score: Score; name: string }

function ScoreItem({ score, name }: ScoreItemProps) {
  const num = useMemo(
    () => score.positiveCount / score.totalCount,
    [score.positiveCount, score.totalCount],
  )
  const img = useMemo(() => {
    if (score.totalCount === 0) return '70'
    if (num >= 0.9) return '90'
    if (num >= 0.8) return '80'
    if (num >= 0.7) return '70'
    if (num >= 0.6) return '60'
    if (num >= 0.5) return '50'
    return '40'
  }, [num, score.totalCount])
  return (
    <li className='flex gap-2 justify-center'>
      <img
        className={cn('flex-none w-20', score.totalCount === 0 && 'grayscale')}
        src={`/flowers/${img}.png`}
        alt=''
      />
      <div>
        <h2 className='text-5xl font-black font-serif'>
          {score.totalCount === 0 ? '--' : `${Math.floor(num * 100)}%`}
        </h2>
        <p className='text-xs font-semibold uppercase'>{name}</p>
        <p className='text-xs'>
          {score.totalCount === 0
            ? 'No Reviews'
            : `${score.totalCount} Reviews`}
        </p>
      </div>
    </li>
  )
}

function Section({ header, children }: PropsWithChildren<{ header: string }>) {
  return (
    <section className='grid gap-2'>
      <h1 className='border-l-2 border-emerald-700 pl-1.5 font-medium text-base uppercase'>
        {header}
      </h1>
      {children}
    </section>
  )
}

function Subheader({ children }: { children: string }) {
  return <h2 className='font-semibold'>{children}</h2>
}
