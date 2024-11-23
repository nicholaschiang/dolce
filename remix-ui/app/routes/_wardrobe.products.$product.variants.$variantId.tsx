import { useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs, type SerializeFrom } from '@vercel/remix'
import { useRef } from 'react'

import { Image } from 'components/image'
import { SaveMenu } from 'components/save-menu'

import { PRODUCT_ASPECT_RATIO, useOptionalUser } from 'utils/general'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const variantId = Number(params.variantId)
  if (Number.isNaN(variantId)) throw new Response('Not Found', { status: 404 })
  const userId = await getUserId(request)
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: {
      images: { orderBy: { position: 'asc' } },
      boards: userId ? { where: { authorId: userId } } : false,
    },
  })
  if (variant === null) throw new Response('Not Found', { status: 404 })
  return variant
}

export default function VariantPage() {
  const variant = useLoaderData<typeof loader>()
  return (
    <ol className='h-0 grow py-2 pl-2 overflow-x-auto overflow-y-hidden flex whitespace-nowrap'>
      {variant.images.map((image, index) => (
        <VariantImage index={index} image={image} key={image.id} />
      ))}
    </ol>
  )
}

type ImageT = SerializeFrom<typeof loader>['images'][number]

function VariantImage({ image, index }: { image: ImageT; index: number }) {
  const variant = useLoaderData<typeof loader>()
  const ref = useRef<HTMLButtonElement>(null)
  const user = useOptionalUser()
  return (
    <li className='aspect-product h-full pr-2'>
      <div className='bg-gray-100 dark:bg-gray-900 w-full h-full overflow-hidden relative'>
        <Image
          className='h-full w-full object-cover'
          onClick={() => ref.current?.click()}
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding={index < 2 ? 'sync' : 'async'}
          src={image.url}
          responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
            (width) => ({
              size: { width, height: width * PRODUCT_ASPECT_RATIO },
              maxWidth: width * 2,
            }),
          )}
        />
        {user && (
          <SaveMenu
            saveAPI={`/api/variants/${variant.id}/save`}
            createAPI={`/api/variants/${variant.id}/save/create`}
            sets={variant.boards}
            ref={ref}
            aria-label='Save product'
            className='absolute top-2 right-2'
          />
        )}
      </div>
    </li>
  )
}
