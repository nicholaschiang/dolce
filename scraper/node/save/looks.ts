import { type Prisma, PrismaClient, SeasonName } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

function getIsabelMarantLookImage(number: number) {
  return `/looks/Isabel-Marant-FW23-${number.toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  })}-1.jpg`
}

export async function save() {
  const video: Prisma.VideoCreateInput = {
    url: '/isabel-marant.mp4',
    mimeType: 'video/mp4',
  }
  const season: Prisma.SeasonCreateInput = {
    name: SeasonName.FALL_WINTER,
    year: 2023,
  }
  const looks = Array(22)
    .fill(null)
    .map((_, index) => {
      const number = index + 1
      const image: Prisma.ImageCreateWithoutLookInput = {
        url: getIsabelMarantLookImage(number),
      }
      const look: Prisma.LookCreateWithoutShowInput = {
        number,
        image: {
          connectOrCreate: { where: { url: image.url }, create: image },
        },
      }
      return look
    })
  const show: Prisma.ShowCreateInput = {
    name: 'Isabel Marant Fall-Winter 2023',
    description: `<p>
          A desire to cuddle up in comfy knitwear and swaddling coats. The
          disorder of some kind of irreverence and a sexy unconventional
          attitude.
        </p>
        <p>
          Metallic zips breathe a perfecto spirit into the collection where
          leather rules. They fasten the jackets and their pockets and blend
          into the pieces as precious details baring a neckline or splitting
          a dress.
        </p>
        <p>
          The graphic cut-outs of the flou shape new cleavages while plays
          on transparency subtly reveal parts of the body. These supple and
          feminine fabrics contrast with heavy cable knits, dyed denim,
          wool, and warm shearlings.
        </p>
        <p>
          The color palette, first natural and minimal, explores yellow and
          magenta horizons before diving into black. A sparkling evening
          mixes textures ‚Äì embroideries, velvet lurex ‚Äì and volumes ‚Äì
          oversized, fitted, cropped.
        </p>
        <p>
          Inside the venue, the show‚Äôs soundtrack performed live by DJ
          Gabber Eleganza and Lulu Van Trapp resonates and intoxicates the
          crowd. A unique creation composed on the idea of desire and
          disorder, this season‚Äôs mantra.
        </p>`,
    criticReviewSummary: `Just as visually dazzling and action-packed as its predecessor, Spider-Man: Across the Spider-Verse thrills from start to cliffhanger conclusion.`,
    consumerReviewSummary: `From incredible animation to a super story and tons of Easter eggs, Spider-Man: Across the Spider-Verse has everything fans could ask for.`,
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
  }
  await prisma.show.create({ data: show })
}

void save()
