import {
  type Prisma,
  Sex,
  Location,
  Level,
  Tier,
  SeasonName,
} from '@prisma/client'

import { slug } from '../utils'

export const NUM_LOOKS = 53

function getLookImage(number: number) {
  const url =
    `https://media.githubusercontent.com/media/nicholaschiang/static/main/shows/hermes/SS23/` +
    `${number.toLocaleString(undefined, { minimumIntegerDigits: 2 })}.webp`
  return url
}

export const video: Prisma.VideoCreateInput = {
  url: 'https://media.githubusercontent.com/media/nicholaschiang/static/main/shows/hermes/SS23/show.mp4',
  mimeType: 'video/mp4',
}
export const season: Prisma.SeasonCreateInput = {
  name: SeasonName.SPRING,
  year: 2023,
}
export const looks = Array(NUM_LOOKS)
  .fill(null)
  .map((_, index) => {
    const number = index + 1
    const image: Prisma.ImageCreateWithoutLookInput = {
      url: getLookImage(number),
    }
    const look: Prisma.LookCreateWithoutShowInput = {
      number,
      images: { connectOrCreate: { where: { url: image.url }, create: image } },
    }
    return look
  })
export const designer: Prisma.UserCreateInput = {
  name: 'Véronique Nichanian',
  url: 'https://fr.wikipedia.org/wiki/V%C3%A9ronique_Nichanian',
  avatar:
    'https://media.githubusercontent.com/media/nicholaschiang/static/main/designers/veronique-nichanian/avatar.jpg',
  description: `
<p>
  Véronique Nichanian was born on May 3, 1954 in Boulogne-Billancourt.In 1976,
  she graduated from the Ecole de la Chambre Syndicale de la Couture Parisienne.
  She started as
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://en.wikipedia.org/wiki/Nino_Cerruti"
    >Nino Cerruti</a
  >'s assistant for men's fashion. At 22, she left to take care of the
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://en.wikipedia.org/wiki/Cerruti_1881"
    >Cerruti</a
  >
  license in Japan. Twelve years later, she was co-responsible for the Cerruti
  men's collections.
</p>
<p>
  Since 1988, she has been artistic director of menswear at
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://en.wikipedia.org/wiki/Herm%C3%A8s"
    >Hermès</a
  >. The former boss of Hermès, Jean-Louis Dumas welcomed her with these words:
  “Run it like your small business. You have carte blanche”. She is the one who
  dresses the demanding Jean-Louis Dumas.
</p>
<p>
  From her very first collection, she was awarded the prize for young designer.
  She has no ambition to open her own house. “It wouldn't change my expression.
  And I don't have an ego problem.”
</p>
`,
}
export const vogue: Prisma.PublicationCreateInput = {
  name: 'Vogue',
  avatar: 'https://www.vogue.com/verso/static/vogue/assets/us/logo.svg',
}
export const purse: Prisma.PublicationCreateInput = {
  name: 'Purse Blog',
  avatar: 'https://www.purseblog.com/wp-content/themes/pb18/images/pb-logo.svg',
}
export const lofficiel: Prisma.PublicationCreateInput = {
  name: 'L’Officiel',
  avatar: 'https://www.lofficielusa.com/images/logo-lofficiel-amtd.svg',
}
export const wwd: Prisma.PublicationCreateInput = {
  name: 'Women’s Wear Daily',
}
export const bazaar: Prisma.PublicationCreateInput = {
  name: 'Harper’s Bazaar',
  avatar:
    'https://media.harpersbazaar.com.sg/2020/08/logo-homepage.svg?compress=true&quality=80&w=320&dpr=2.0',
}
export const highs: Prisma.PublicationCreateInput = {
  name: 'Highsnobiety',
}
export const fashionotography: Prisma.PublicationCreateInput = {
  name: 'Fashionotography',
}
// Scores assigned by gpt-3.5-turbo via the ChatGPT and the following prompt:
// Assign a sentiment score (on a five-star scale) to the following review. Air
// on the side of a lower score (very few reviews should ever receive or come
// close to receiving a 5/5). Often, if a review is simply neutral or is vague
// in its compliments, it should be assigned a 1/5 or 2/5. If a review seems
// energetically positive, assign a 3/5. Only if a review is resoundingly
// enthusiastically positive should you assign a 4/5. Never assign a 5/5.
export const reviews: Prisma.ReviewCreateWithoutShowInput[] = [
  {
    author: {
      connectOrCreate: {
        where: { name: 'Christian' },
        create: {
          name: 'Christian',
          url: 'https://www.fashionotography.com/author/christian/',
        },
      },
    },
    score: 3 / 5,
    publication: {
      connectOrCreate: {
        where: { name: fashionotography.name },
        create: fashionotography,
      },
    },
    url: 'https://www.fashionotography.com/hermes-spring-summer-2023-pfw-mens/',
    content: `
<p>
  Lightness and pleasure, two notions closely associated with summer vacations,
  were the focus of the Hermès Men’s
  <span style="text-decoration: underline"
    ><a
      href="https://www.fashionotography.com/?s=spring%2Fsummer+2023+paris+fashion+week"
      target="_blank"
      rel="noreferrer noopener"
      >Spring/Summer 2023</a
    ></span
  >
  collection that took place at the historic tapestry factory Manufacture des
  Gobelins.
</p>
<p>
  In the mood for vacation – “<em
    >a magical destination that is both joyful and serene</em
  >“, in the words of the French fashion house’s press release – Véronique
  Nichanian sent a plethora of marine-themed pieces down the runway. There was a
  succession of short cotton jackets with seaweed motifs, a short-sleeved
  cashmere sweater with a crayfish on the front, a sunny yellow tank top and a
  white shirt with a large seahorse – emerald blue for the first, navy blue for
  the second.
</p>
<p>
  There was almost no suit in sight in this collection, but a series of light
  jackets perfect for long walks by the sea, school shorts, wide and mid-calf,
  windbreakers in nylon, fine cotton or second-skin leather, tight-fitting
  knitwear as well as many bobs in summery shades, including lilac, grapefruit
  and aqua.
</p>
<p>
  All of these comfortable pieces were paired with neoprene sandals, brightly
  colored sneakers, or updated Izmir sandals with extra straps. The iconic
  Birkin for men came with a distorted tile as well as three iconic bags from
  the
  <a
    href="https://www.instagram.com/hermes/"
    target="_blank"
    rel="noreferrer noopener nofollow"
    >Hermès</a
  >
  archives (the Garden Party 36, the Bolide, and the Haut à courroies) were also
  included.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Tayler Willson' },
        create: {
          name: 'Tayler Willson',
          url: 'https://www.highsnobiety.com/author/tayler-willson/',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: highs.name },
        create: highs,
      },
    },
    url: 'https://www.highsnobiety.com/p/hermes-spring-summer-2023/',
    score: 3 / 5,
    content: `
<p>
  There isn’t much Véronique Nichanian hasn’t turned her hand to during her
  thirty-plus years as creative director of Hermès Men, yet she still never
  ceases to amaze season on season.
</p>
<p>
  Amidst a plethora of marine-themed pieces (including a crayfish sweater and a
  shirt with a sea horse on it), cotton jackets, and a wide array of
  accessories, Hermès Spring/Summer 2023 was undoubtedly a lesson in colorful
  outerwear – on what was an overcast day in the French capital.
</p>
<p>
  Taking place at the iconic Manufacture des Gobelins, Hermès SS23 put a myriad
  of stand-out windbreakers, pullovers, and matching bucket hats center stage,
  each of which crafted with a material that could’ve been mistaken for
  heavy-duty PVC and decorated in a rainbow of vibrant hues.
</p>
<p>
  Outerwear came accompanied by a variety of lightweight jackets perfect for
  breezy summer lunches, too – something certainly in-keeping with Nichanian’s
  aim of designing a collection “all about holiday” and “lightness and having
  fun, pop colors and the natural world” – as well as shirting and lightweight
  cashmere pieces.
</p>
<p>
  Footwear also caught the eye as Hermès looked to be delivering updated takes
  on its Izmir Sandal with added strapping and saucier tones, as a new series of
  sneakers also arrived in droves of pleasing contrasting colors, like orange
  and brown, and blue and aqua.
</p>
<p>
  While Hermès’ Paris show may be remembered by many as another strong offering
  of elevated everyday wear off the continually impressive Nichanian conveyor
  belt, for us it will forever be a lesson in keeping dry, in style.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Navin Pillay' },
        create: { name: 'Navin Pillay' },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: bazaar.name },
        create: bazaar,
      },
    },
    url: 'https://www.harpersbazaar.com.sg/gallery/all-the-looks-from-the-hermes-spring-summer-2023-mens-collection/',
    score: 2 / 5,
    content: `
<p>
  Held at <strong>Manufacture des Gobelins</strong> this past weekend, the
  <strong>Hermès</strong> spring/summer 2023 men’s collection is a masterclass
  in refined summer dressing. It’s all about rediscovering the joys of being
  together with loved ones, while enjoying the midsummer breeze. This sense of
  lightness also underlines the 53 looks that make up this collection, rendered
  in pastel shades and neutrals.
</p>
<p>
  Creative director <strong>Véronique Nichanian</strong> once again reminds the
  world why Hermès is globally revered for its expert craftsmanship. Apart from
  extremely wearable separates in fabrics that sway in the wind, the collection
  also comprises garments such as straight blousons in full-grain suede
  calfskin; overshirts in Herbier perforated sporty calfskin; trousers with
  drawstring waist in plume nubuck calfskin; and hooded parkas in light
  technical satin.
</p>
<p>
  Elsewhere in the collection, expect large, collarless shirts in cotton and
  linen piqué, high-neck pullovers in cashmere with crayfish design and
  highly-desirable carrot-fit trousers that will surely be your new summer
  staple. And the Garden Party Voyage bags—in plain, striped or Hermès Pacific
  printed H canvas and Sombrero calfskin—are perhaps the most covetable
  accessories in the collection.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Samantha Conti' },
        create: {
          name: 'Samantha Conti',
          url: 'https://wwd.com/wwd-masthead/samantha-conti/',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: wwd.name },
        create: wwd,
      },
    },
    url: 'https://wwd.com/runway/mens-spring-2023/paris/hermes/review/',
    score: 3 / 5,
    content: `
<p>
  The living is easy at Hermès, which showed off a collection of summery gelato
  tones and radiated sunshine on an otherwise gray and drizzly Paris day.
</p>
<p>
  Véronique Nichanian said she wanted this collection to be “all about holiday —
  not the city. It’s about lightness and having fun, pop colors and the natural
  world.”
</p>
<p>
  The show, which took place outside, on the grounds of the historic tapestry
  factory Manufacture des Gobelins, was pure escapism for guests, many of whom
  were wearing hooded khaki raincoats that Hermès staffers distributed at the
  entrance to the show.
</p>
<p>
  By contrast, models were dressed for déjeuner at Hotel du Cap-Eden-Roc, or
  aperitivo hour at Villa d’Este. They wore sunshine yellow twin-sets, and
  marine-themed tops, including a short-sleeved cashmere sweater with a crayfish
  on the front, and a roomy white shirt with a big blue seahorse.
</p>
<p>
  Short, cotton jackets came with seaweed patterns and beachy-bright cotton
  canvas bags had a palm tree print and rope handles. Windbreakers, shiny
  lightweight parkas and bucket hats came in a rainbow of colors, including
  lilac, grapefruit and aqua.
</p>
<p>
  These weren’t so much for rainy days, but for the salty spray on the deck of a
  yacht as it cuts through the Mediterranean.
</p>
<p>
  Nichanian also set out to replicate the ripples of a swimming pool, with
  crinkly stripes on tailored jackets and the wobbly wave design on a roomy
  white turtleneck with a big beige sun on the front. Hopefully the real thing
  will return to Paris soon.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Margherita Meda' },
        create: { name: 'Margherita Meda' },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: lofficiel.name },
        create: lofficiel,
      },
    },
    url: 'https://www.lofficielibiza.com/fashion/hermes-man-collection-spring-summer-2023-photo-fashion-show',
    score: 4 / 5,
    content: `
<p>
  Nobody is like <strong>Hermes</strong>. A centenary luxury that continues to
  renew itself without forgetting its values. The
  <strong>men's Spring Summer 2023 collection</strong> presented in Paris during
  Paris Fashion Week at the <span>Manufacture des Gobelins</span> and which the
  <strong>creative director Véronique Nichanian</strong> defines as "
  <em>innovatively fascinating</em> ", is extremely summery and above all,
  innovative: the masculine stylistic codes are deconstructed and rewritten,
  <strong>colored with lilac</strong> , apricot and raspberry and decorated with
  hyper cool and fun patterns, such as seahorses and shrimps.
</p>
<p>
  SS23 is <strong>extremely sunny and playful</strong> , a collection that mixes
  classic and minimal pieces with riskier new garments for the Hermès wardrobe.
  Those who are fond of tradition should not despair, each garment is
  exceptional and recognizable (and how could it be the other way around? Hermès
  iconography is unique) despite being a collection dedicated to
  experimentation: the key to understanding SS23 is to grasp the delicate
  collision of the
  <a
    href="https://www.lofficielibiza.com/fashion/jaquemus-nike-collaboration-minimalism-for-sports-fans"
    >sporting world</a
  >
  with that of the most formal archetypes. The classic symbols of the Maison
  then, are proposed through Pegasus reliefs and patches on informal and casual
  jackets, combined with mid-calf shorts with wide legs.
</p>
<p>
  The gems of the Spring Summer 2023 men's collection are certainly the lilac
  crocodile jacket and the men's Birkins (which needs no introduction; it's
  always her, with her eternal elegance and ethereal classicism). The shoes of
  the summer? Canvas-edged neoprene sandals and hyper-colored trainers, an
  essential and unorthodox resource for any occasion.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Alessandro Viapiana' },
        create: { name: 'Alessandro Viapiana' },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: lofficiel.name },
        create: lofficiel,
      },
    },
    url: 'https://www.lofficielusa.com/fashion/hermes-spring-summer-2024-collection',
    score: 3 / 5,
    content: `
<p>
  The
  <a
    href="https://www.lofficielusa.com/fashion-week/hermes-fall-winter-2022-men-collection-veronique-nichanian"
    target="_blank"
    rel="noreferrer noopener"
    >Hermès</a
  >
  Spring/Summer 2024 collection is a journey of discovery of the male body. With
  a wardrobe that exudes elegance, warmth, and undeniable tenderness, the
  collection has come just in time for you to embark on your
  <a
    href="https://www.lofficielusa.com/fashion/italian-summer-style-movies"
    title="5 Films to Watch for Italian Summer Style Inspiration"
    target="_blank"
    rel="noreferrer noopener"
    >European travels</a
  >. Showcasing visible tank tops under
  <a
    href="https://www.lofficielusa.com/fashion/sheer-mesh-trend-spring-2021-instagram"
    title="Dare To Go Sheer With the Mesh Trend"
    target="_blank"
    rel="noreferrer noopener"
    >mesh</a
  >
  shirts, slim trousers, and transparent jackets, the collection is a
  declaration of love for the
  <a
    href="https://www.lofficielusa.com/fashion/barcelona-fashion-trend-summer-looks"
    title="Embrace the Joy of Summer Fashion"
    target="_blank"
    rel="noreferrer noopener"
    >summer season</a
  >.
</p>
<p>
  The woman behind the "menswear universe" at Hermés is the
  brand's artistic director
  <a
    href="https://www.lofficielusa.com/fashion-week/hermes-fall-winter-2022-men-collection-veronique-nichanian"
    title="Hermès Men’s Fall/Winter 2022 Collection"
    target="_blank"
    rel="noreferrer noopener"
    >Véronique Nichanian</a
  >. Dedicated to creating a liberating but serene wardrobe to capture Hermés'
  desirable taste, Nichanian's use of iconic motifs and teasing transparencies
  transports us to a balmy day in Paris, France. With a freshness that seems to
  recall the work of her younger colleagues, Nichanian's creation is a
  reflection of her intelligence and versatility in anticipating ever-changing
  <a
    href="https://www.lofficielusa.com/fashion/spring-summer-2023-runway-trend-astrology-zodiac-sign-shopping"
    title="The Spring/Summer 2023 Fashion Trend to Try, Based on Your Zodiac Sign"
    target="_blank"
    rel="noreferrer noopener"
    >fashion trends</a
  >. Residing as the paragon of the dream European summer, the Hermés
  Spring/Summer 2024 collection can be further explored on
  <a
    href="https://www.hermes.com/us/en/"
    title="Hermes.com"
    target="_blank"
    rel="noreferrer noopener"
    >Hermes.com</a
  >.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Luke Leitch' },
        create: {
          name: 'Luke Leitch',
          url: 'https://www.vogue.com/contributor/luke-leitch',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: vogue.name },
        create: vogue,
      },
    },
    url: 'https://www.vogue.com/fashion-shows/spring-2023-menswear/hermes',
    score: 2 / 5,
    content: `
<p>
  Asked whether after 33 years in her position as the prime female designer of menswear in luxury she shapes her vision of men through a female gaze, Véronique Nichanian demurred. “Not at all,” she said: “I just try to propose things that make them more charming. I don’t judge the man… c’est une proposition tendre.”
</p>
<p>
  We were in the Manufacture des Gobelins, where the models walked a cobbled runway which inadvertently echoed the central motif of the collection. That was a hazy irregular grid—a distorted check or tattersall—that Nichanian said was meant to reflect the tiles at the bottom of a swimming pool when looked at through a distorting prism of water. Over the decades moss had grown around the runway cobbles, distorting their grid too.
</p>
<p>
  In her time Nichanian has seen the codified structures of menswear bend, collapse and distort. She reflected this, tenderly and with sympathy, in designs that blended the bended parameters of dressing today. This was a summer collection, hence the literal solar knitwear and marine life prints of seahorses and crayfish. House iconography—certainties to rally around—were expressed via Pegasus reliefs and house patches, something as close to logo dressing as I have ever seen here, on crisp informal jackets. Deconstructed jackets were teamed with schoolboy shorts, wide-legged, mid-calf and inherently naive. Sandals in canvas-edged neoprene and sneakers strafed with color provided unpretentiously unorthodox foundations for the looks built above.
</p>
<p>
  There was great luxury in a lilac crocodile blouson, say, or the specially-commissioned masculine Birkins gridded with that distorted check, but also great practicality and empathy too. Difficult colors—apricot, lilac, raspberry—were blended through layering into harmonic balance via the gentle collision of sports and formal archetypes. Crisp suiting in pajama light cotton was delivered with pants discreetly elasticated beneath the skirt of the jacket. When the rules have been bent and distorted by a new lens of context, you can only adapt—with tenderness.
</p>
`,
  },
  {
    author: {
      connectOrCreate: {
        where: { name: 'Notorious Pink' },
        create: {
          name: 'Notorious Pink',
          url: 'https://www.purseblog.com/author/bari/',
        },
      },
    },
    publication: {
      connectOrCreate: {
        where: { name: purse.name },
        create: purse,
      },
    },
    url: 'https://www.purseblog.com/hermes/hermes-mens-spring-summer-2023-rtw-review-genre-bending-appeal/',
    score: 3 / 5,
    content: `
<p>
  Despite the chatter about the Hermès Men’s Spring-Summer 2023 show being a very literal homage to the season (suns and seahorses and beach critters adorning the clothing), or the lightness and accessibility of the ready-to-wear itself, what I saw last week in the presentation was best exemplified by the runway Haut À Courroies carried down the runway: a large bag, a seemingly-utilitarian man’s bag – a bag which, in fact, has become iconographic of women’s fashion – adorned with wavy, incongruent lines which also somehow did not distort the appearance of the bag but merely enhanced and delineated its dimensions.
</p>
<p>
  So too, looking over the menswear, I was struck by the colors – pink, lavender, aqua, and yellow – which are not typical of traditional men’s clothing and which further were presented in very appealing profiles and cuts. While atypical, the colors and shapes only enhanced the ready-to-wear, delineating function or adding a genuine visual appeal. The masculine has become feminine, or at the very least, extremely versatile; finally, it is a nod to fashion’s existential compatibility (or sometimes, notoriously, its incompatibility) with practicality and general appeal.
</p>
<p>
  In short, Hermès knows its customers, and it seems to have noticed that no longer do we stick to one department: many women buy from the men’s department, and vice-versa; further if one is to wear color at all, we are no longer tied to particular palettes (or bag, sizes, for that matter). The colors, while definitely visually eye-catching (please please please let these colors be translated to the leather goods!) didn’t seem costumey or out of place. The result was a men’s collection that further blurs the line between menswear and womenswear, with everyone clamoring for a little bit of both (as hopeful an expression of equality of the sexes if ever there was one).
</p>
<p>
  And with that, a few notes:
</p>
<p>
  Bags were huge in the show, both literally and figuratively: the HACs (40cm? 50cm?); a giant lime Bolide emblazoned with studs in the shape of a heart; a supersized Garden Party, apparently meant to carry the entire garden; and other totes, whether for the beach or travel, which appeared large enough to carry everything one would need (is this new dimension a glimpse of what’s to come for the women?).
</p>
<p>
  Accessories seemed minimal, but most of note were the woven leather belts reminiscent of preppy fashion, tied like we used to in the 80s with the end hanging down, and a further iteration of the Dad sandal in a neoprene summer version.
</p>
`,
  },
]
export const country = {
  where: { code: 'fr' },
  create: { name: 'france', code: 'fr' },
}
export const brand: Prisma.BrandCreateInput = {
  name: 'Hermès',
  slug: slug('Hermès'),
  description:
    'Hermès International S.A. is a French luxury design house established in 1837. It specializes in leather goods, lifestyle accessories, home furnishings, perfumery, jewelry, watches and ready-to-wear. Since the 1950s, its logo has been a depiction of a ducal horse-drawn carriage.',
  tier: Tier.SUPERPREMIUM,
  avatar:
    'https://www.hermes.com/sites/all/themes/custom/hermes/img/hermes-logo.svg',
  url: 'https://www.hermes.com',
  country: { connectOrCreate: country },
  company: {
    connectOrCreate: {
      where: { name: 'Hermès International S.A.' },
      create: {
        name: 'Hermès International S.A.',
        url: 'https://finance.hermes.com/',
        description: '',
        country: { connectOrCreate: country },
      },
    },
  },
}
export const link: Prisma.LinkCreateInput = {
  url: 'https://www.hermes.com/us/en/category/men/ready-wear/spring-summer-collection/#|',
  brand: { connectOrCreate: { where: { name: brand.name }, create: brand } },
}
export const collection: Prisma.CollectionCreateInput = {
  name: 'Hermès Spring-Summer 2023 Menswear',
  season: {
    connectOrCreate: {
      where: { name_year: { name: season.name, year: season.year } },
      create: season,
    },
  },
  designers: {
    connectOrCreate: { where: { name: designer.name }, create: designer },
  },
  links: { connectOrCreate: { where: { url: link.url }, create: link } },
}
export const show: Prisma.ShowCreateInput = {
  name: 'Hermès Spring-Summer 2023 Menswear',
  level: Level.RTW,
  sex: Sex.MAN,
  url: 'https://www.hermes.com/us/en/story/302944-men-summer-2023-runway-show/',
  description: `A bright, vibrant summer; the joy of being together. The vacation spirit, a magic destination both joyous and serene, with the breeze imperceptibly ruffling the clothes that enfold you. A feeling of lightness makes you float in the sunlight.

    The colors of the clothes are sweetly poetic: lemonade, lagoon, lilac, bubblegum, melon, etc. Sometimes the light turns them white, or pastel.

    Undulating forms of aqueous transparency: some prints seemingly move of their own volition, lines deviating slightly on their sloping path to freedom; here a pocket slides and shifts as if desiring to head outward. Elsewhere, a shirt proudly displays a bold and charming seahorse, or a spectacular giant crayfish.

    Berlingot canvas, nubuck calfskin, crepe cotton serge, perforated leather, sunset tints... the collection is precise, crafted with the refinement of the hand and the nonchalance of a mind that is free of barriers.

    In the open-air enclosure of the Manufacture des Gobelins, Cyril Teste, close partner of Véronique Nichanian, imagined a gesture in the form of a canvas sliding out of the building, swaying slightly in the breeze before disappearing – as if diving – through a workshop window.`,
  criticReviewSummary: `Hermès Spring-Summer 2023 Mens Ready-to-Wear delights with its innovative fusion of colors, playful marine-themed designs, and luxurious practicality. Véronique Nichanian’s collection blurs the boundaries between menswear and womenswear, offering a tender and harmonious wardrobe that celebrates the joy and lightness of summer.`,
  consumerReviewSummary: null,
  date: new Date('June 25, 2022'),
  location: Location.PARIS,
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
  brand: { connectOrCreate: { where: { name: brand.name }, create: brand } },
}
