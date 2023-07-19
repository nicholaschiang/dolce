import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { ExternalLink } from 'lucide-react'
import { nanoid } from 'nanoid/non-secure'
import { type PropsWithChildren } from 'react'

import { Button } from 'atoms/Button'
import { Empty } from 'atoms/Empty'
import { Textarea } from 'atoms/Textarea'

import { prisma } from 'db.server'
import { filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader({ params }: LoaderArgs) {
  log.debug('getting show...')
  const showId = Number(params.showId)
  if (Number.isNaN(showId)) throw new Response(null, { status: 404 })
  const show = await prisma.show.findUnique({
    where: { id: showId },
    include: {
      video: true,
      reviews: true,
      looks: { include: { image: true } },
    },
  })
  log.debug('got show %o', show)
  if (show == null) throw new Response(null, { status: 404 })
  return show
}

type ScoreProps = { value: number; label: string; count: string }

function Score({ value, label, count }: ScoreProps) {
  return (
    <li>
      <h2 className='text-3xl font-black'>{value * 100}%</h2>
      <p className='text-2xs font-bold uppercase'>{label}</p>
      <p className='text-2xs'>{count}</p>
    </li>
  )
}

type SectionProps = PropsWithChildren<{ header: string }>

function Section({ header, children }: SectionProps) {
  return (
    <section className='mt-6'>
      <h1 className='border-l-[3px] border-primary pl-2 font-bold mb-2'>
        {header}
      </h1>
      {children}
    </section>
  )
}

function Subheader({ children }: { children: string }) {
  return <h2 className='font-semibold mb-2 mt-6'>{children}</h2>
}

export default function CollectionsPage() {
  const show = useLoaderData<typeof loader>()
  const filter: Filter<'looks', 'some'> = {
    id: nanoid(5),
    name: 'looks',
    condition: 'some',
    value: { showId: show.id },
  }
  const param = filterToSearchParam(filter)
  return (
    <main className='h-full flex-1 overflow-hidden max-w-screen-xl mx-auto grid grid-cols-5'>
      <div className='overflow-auto col-span-2 py-6 pl-6 pr-3'>
        <ol className='grid grid-cols-2 gap-2'>
          {show.looks.map((look) => (
            <li className='rounded-md overflow-hidden' key={look.id}>
              <img src={look.image.url} alt={`Look ${look.number}`} />
            </li>
          ))}
        </ol>
      </div>
      <div className='overflow-auto col-span-3 flex flex-col gap-4 py-6 pr-6 pl-3'>
        <video className='rounded-md' controls>
          <source src={show.video.url} type={show.video.mimeType} />
          Download the <a href={show.video.url}>MP4</a> video.
        </video>
        <div className='flex gap-4'>
          <div className='flex-none w-40 bg-gray-100 dark:bg-gray-800 rounded-md' />
          <article className='flex-1 bg-gray-100 dark:bg-gray-800 rounded-md text-center p-6'>
            <h1 className='text-2xl mb-2 font-semibold'>{show.name}</h1>
            <ul className='grid grid-cols-2 gap-2'>
              <Score value={0.82} label='Tomatometer' count='339 Reviews' />
              <Score
                value={0.94}
                label='Audience Score'
                count='10,000+ Ratings'
              />
            </ul>
          </article>
        </div>
        <Section header='What to know'>
          <Subheader>Critics Consensus</Subheader>
          <p>{show.criticReviewSummary}</p>
          <Subheader>Audience Says</Subheader>
          <p>{show.consumerReviewSummary}</p>
        </Section>
        <Section header='Where to buy'>
          <Empty>Coming soon</Empty>
        </Section>
        <Section header='Collection info'>
          <article
            className='prose-sm dark:prose-invert'
            dangerouslySetInnerHTML={{ __html: show.description }}
          />
        </Section>
        <Section header='Rate and review'>
          <Textarea placeholder='What did you think of the collection? (optional)' />
          <Button>Submit</Button>
        </Section>
        <Section header={`Critic reviews for ${show.name}`}>
          <Review
            author={{
              name: 'Mark Holgate',
              url: 'https://www.vogue.com/contributor/mark-holgate',
            }}
            publication='Vogue'
            url='https://www.vogue.com/fashion-shows/fall-2023-ready-to-wear/isabel-marant'
          >
            <p>
              God bless Isabel Marant. It was the Thursday night of the Paris
              shows, and ennui had definitely started to set in. Yet here was
              Marant, throwing us a party as show in the shadow of the Palais
              Royal, complete with screaming kids, a mosh pit, a sound system
              doing mega decibels, and a performance from singer Rebecca Baby
              from Lulu Van Trapp, who belted out a club tune whose lyrics
              consisted almost solely of repeating “desire” and “disorder” over
              and over again, to the point that you were mouthing them yourself.
              (Still am, actually.) At the finale of the show, Baby threw
              herself into the writhing crowd and glorious chaos ensued.
            </p>
            <p>
              Meanwhile, some of the world’s greatest runway strutters stepped
              forward: Natasha Poly, Liya Kebede, Anna Ewers, Caroline Trentini,
              Liu Wen, Jessica Stam, Malgosia Bela, Kasia Struss, Anna
              Selezneva, Delfine Bafort—yep, and there’s more—Suvi Riggs,
              Aymeline Valade, Karmen Pedaru, Sasha Pivovarova, Julia Stegner
              and Imaan Hammam worked the runway in Marant’s knockout fall
              collection. That consisted of swaggering square shouldered blazers
              (fall 2023 will be forever known as The Season of The Jacket),
              oversized parkas, boyish sweaters, ’80s cocoon coats, uber conical
              heeled boots, slinky dresses—some zippered, some crystal
              embellished, many with footless hose—and a killer new jean shape
              with a contrast yoke and straight yet slouchy legs.
            </p>
            <p>
              But back to desire and disorder. No, not the sad state of my
              dating life, but the two states that Marant was thinking about for
              fall. The <em>desire</em> doesn’t need much explaining. Marant has
              long championed female empowerment in everything her label stands
              for, and that includes making the kind of louche, sexy but always
              spiritedly casual look that focuses on allowing the woman wearing
              her clothes to express herself and her physicality. There was
              plenty of that here, and good it looked, too—especially on the
              starry cast of ‘older’ models, with plenty of blouson-y biker
              leathers and leggy boots. (Though if one wish could have been
              granted here, some curvier models would have been nice to have in
              the mix.) As for the <em>disorder</em>, that was all about the
              poppers haphazardly fastening a fuzzy mini sweater dress, or the
              graphic slashes that appeared here and there throughout the
              collection.
            </p>
            <p>
              In a season where the everyday and the real are being celebrated
              and elevated, where good clothes can matter and not be disposable,
              Marant cannily underscored how much she’s been doing that for
              years now. That, plus the casting of models who are her stalwarts,
              women who’ve been around a bit but still look utterly fab, not to
              mention the celebratory atmosphere of her show, was all a smart
              reminder that when it comes to wearing Isabel Marant, looking good
              and feeling good are always the same thing.
            </p>
          </Review>
          <Review
            author={{
              name: 'Grace Gordon',
              url: 'https://www.savoirflair.com/editor/grace-gordon',
            }}
            publication='Savior Flair'
            url='https://www.savoirflair.com/fashion/629428/isabel-marant-fall-winter-2023'
          >
            <p>
              Who’s ready to party?! <b>Isabel Marant</b>, that’s who. In
              combining her Fall/Winter 2023 show with a raging party
              atmosphere, she smashed through the doldrums of Paris Fashion Week
              (which looks so glamorous but is often described by attendees as a
              slog, a grind, and totally, utterly exhausting).
            </p>
            <p>
              Not only were there mosh pits, screaming fans, and live musical
              performances to keep energy levels high, but there was also a
              truly astonishing marquee line-up of veteran supermodels on the
              runway. Out came Imaan Hammam, Sasha Pivovarova, Natasha Poly, Liu
              Wen, Liya Kebede, Jessica Stam, and dozens of other all-star
              models. We were living for it.
            </p>
            <p>
              Given the mood of the show, it would be easy to think the clothes
              would reflect a nightlife atmosphere, but Marant stuck to her
              codes and delivered a gorgeous collection filled with roomy
              knitwear, smashing outerwear, slouchy separates, and other
              cool-girl attire. There were shearling-lined funnel-necked coats,
              knit dresses covered in a thick spiderweb of fabric detailing,
              leather jackets with asymmetrical zippers that were worn sans
              pants (but with beautiful thigh-high boots), sharky suits, floaty
              dresses, holey crocheted sweaters, and more.
            </p>
            <p>
              One dress looked like it had been reappropriated from a shawl,
              another was fuzzy and sprouted metallic tinsel, and the finale
              looks bore glam sparkle courtesy of silver paillette adornments.
              There was nothing forced about any of it; it was simply Isabel
              Marant doing her cool French thing and making it all look wearable
              and desirable without the pall of merchandising or social media
              gimmicks. The party was a bonus.
            </p>
          </Review>
        </Section>
      </div>
    </main>
  )
}

type ReviewProps = {
  author?: { name: string; url: string }
  publication: string
  url: string
}

function Review({
  author,
  publication,
  url,
  children,
}: PropsWithChildren<ReviewProps>) {
  return (
    <figure className='flex-none bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden'>
      <blockquote className='prose-sm dark:prose-invert p-4' cite={url}>
        {children}
      </blockquote>
      <figcaption className='px-4 py-2 bg-gray-200 dark:bg-gray-700 flex justify-between'>
        {author != null && (
          <p>
            —
            <a href={author.url} target='_blank' rel='noopener noreferrer'>
              {author.name}
            </a>
            , <cite>{publication}</cite>
          </p>
        )}
        {author == null && (
          <p>
            —<cite>{publication}</cite>
          </p>
        )}
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='h-6 w-6 flex items-center justify-center rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          <ExternalLink className='w-4 h-4' />
        </a>
      </figcaption>
    </figure>
  )
}
