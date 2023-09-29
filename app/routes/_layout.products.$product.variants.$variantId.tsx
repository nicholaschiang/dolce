import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'

import { Image } from 'components/image'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderArgs) {
  const variantId = Number(params.variantId)
  if (Number.isNaN(variantId)) throw new Response('Not Found', { status: 404 })
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { images: { orderBy: { position: 'asc' } } },
  })
  if (variant === null) throw new Response('Not Found', { status: 404 })
  return variant
}

const widthToHeightImageRatio = 4 / 5

export default function VariantPage() {
  const variant = useLoaderData<typeof loader>()
  return (
    <div className='w-0 flex-1 grid grid-cols-2 gap-2'>
      {variant.images.map((image, index) => (
        <div
          key={image.id}
          className='aspect-product bg-gray-100 dark:bg-gray-900'
        >
          <Image
            className='h-full w-full object-cover'
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding={index < 2 ? 'sync' : 'async'}
            src={image.url}
            responsive={[200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
              (width) => ({
                size: { width, height: width * widthToHeightImageRatio },
                maxWidth: width * 2,
              }),
            )}
          />
        </div>
      ))}
    </div>
  )
}
