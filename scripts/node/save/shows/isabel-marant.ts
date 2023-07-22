import { type Prisma, Tier, SeasonName } from '@prisma/client'

const NUM_LOOKS = 59

function getLookImage(number: number) {
  const url =
    `https://static.nicholas.engineering/shows/isabel-marant/FW23/` +
    `${number.toLocaleString(undefined, { minimumIntegerDigits: 2 })}.jpg`
  return url
}

const video: Prisma.VideoCreateInput = {
  url: 'https://static.nicholas.engineering/shows/isabel-marant/FW23/show.mp4',
  mimeType: 'video/mp4',
}
const season: Prisma.SeasonCreateInput = {
  name: SeasonName.FALL_WINTER,
  year: 2023,
}
const looks = Array(NUM_LOOKS)
  .fill(null)
  .map((_, index) => {
    const number = index + 1
    const image: Prisma.ImageCreateWithoutLookInput = {
      url: getLookImage(number),
    }
    const look: Prisma.LookCreateWithoutShowInput = {
      number,
      image: {
        connectOrCreate: { where: { url: image.url }, create: image },
      },
    }
    return look
  })
const vogue: Prisma.PublicationCreateInput = {
  name: 'Vogue',
  avatar: 'https://www.vogue.com/verso/static/vogue/assets/us/logo.svg',
}
const savoir: Prisma.PublicationCreateInput = {
  name: 'Savior Flair',
  avatar:
    'https://www.kindpng.com/picc/m/266-2665896_file-ntsw4mb-savoir-flair-arabia-logo-hd-png.png',
}
const reviews: Prisma.ReviewCreateWithoutShowInput[] = [
  {
    author: {
      connectOrCreate: {
        where: { name: 'Mark Holgate' },
        create: {
          name: 'Mark Holgate',
          url: 'https://www.vogue.com/contributor/mark-holgate',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: vogue.name },
        create: vogue,
      },
    },
    url: 'https://www.vogue.com/fashion-shows/fall-2023-ready-to-wear/isabel-marant',
    content: `
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
          </p>`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Grace Gordon' },
        create: {
          name: 'Grace Gordon',
          url: 'https://www.savoirflair.com/editor/grace-gordon',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: savoir.name },
        create: savoir,
      },
    },
    url: 'https://www.savoirflair.com/fashion/629428/isabel-marant-fall-winter-2023',
    content: `
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
`,
  },
]
const country = {
  where: { code: 'fr' },
  create: { name: 'france', code: 'fr' },
}
const brand: Prisma.BrandCreateInput = {
  name: 'Isabel Marant',
  description:
    'Isabel Marant is a French fashion designer, owner of the eponymous fashion brand. She won the Award de la Mode, the Whirlpool Award for best female designer, Fashion Designer of the Year at British Glamour’s Women of the Year Awards. She was named Contemporary Designer of the Year at the Elle Style Awards in 2014.',
  tier: Tier.PREMIUM_CORE,
  country: { connectOrCreate: country },
  company: {
    connectOrCreate: {
      where: { name: 'Montefiore Investment' },
      create: {
        name: 'Montefiore Investment',
        description: '',
        country: { connectOrCreate: country },
      },
    },
  },
}
const collection: Prisma.CollectionCreateInput = {
  name: 'Isabel Marant Fall-Winter 2023',
  season: {
    connectOrCreate: {
      where: { name_year: { name: season.name, year: season.year } },
      create: season,
    },
  },
}
export const show: Prisma.ShowCreateInput = {
  name: 'Isabel Marant Fall-Winter 2023',
  url: 'https://www.isabelmarant.com/us/lookbooks/isabel-marant/isabel-marant-fall-winter-2023/',
  description: `A desire to cuddle up in comfy knitwear and swaddling coats. The disorder of some kind of irreverence and a sexy unconventional attitude.

Metallic zips breathe a perfecto spirit into the collection where leather rules. They fasten the jackets and their pockets and blend into the pieces as precious details baring a neckline or splitting a dress.

The graphic cut-outs of the flou shape new cleavages while plays on transparency subtly reveal parts of the body. These supple and feminine fabrics contrast with heavy cable knits, dyed denim, wool, and warm shearlings.

The color palette, first natural and minimal, explores yellow and magenta horizons before diving into black. A sparkling evening mixes textures – embroideries, velvet lurex – and volumes – oversized, fitted, cropped.

Inside the venue, the show’s soundtrack performed live by DJ Gabber Eleganza and Lulu Van Trapp resonates and intoxicates the crowd. A unique creation composed on the idea of desire and disorder, this season’s mantra.`,
  criticReviewScore: 0.94,
  criticReviewSummary: `A high-energy party atmosphere and a stunning lineup of veteran supermodels—a much needed refresher from Paris Fashion Week. The designs exude Isabel Marant’s signature style, featuring roomy knitwear, smashing outerwear, and cool-girl attire, all while empowering wearability and desirability. With a focus on desire and disorder, the collection showcases unique graphic cut-outs, metallic zips, and playful contrasts, leaving a lasting impression on the audience.`,
  consumerReviewScore: null,
  consumerReviewSummary: null,
  date: new Date('March 2, 2023'),
  location: 'Paris, France',
  video: { connectOrCreate: { where: { url: video.url }, create: video } },
  season: {
    connectOrCreate: {
      where: { name_year: { name: season.name, year: season.year } },
      create: season,
    },
  },
  looks: { create: looks },
  reviews: { create: reviews },
  collections: {
    connectOrCreate: { where: { name: collection.name }, create: collection },
  },
  brands: { connectOrCreate: { where: { name: brand.name }, create: brand } },
}
