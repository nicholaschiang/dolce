import { useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'

import { Image } from 'components/image'

import { PRODUCT_ASPECT_RATIO } from 'utils/general'

import { prisma } from 'db.server'

export async function loader({ params }: DataFunctionArgs) {
  const variantId = Number(params.variantId)
  if (Number.isNaN(variantId)) throw new Response('Not Found', { status: 404 })
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { images: { orderBy: { position: 'asc' } } },
  })
  if (variant === null) throw new Response('Not Found', { status: 404 })
  return variant
}

export default function VariantPage() {
  const variant = useLoaderData<typeof loader>()
  return (
    <ol className='h-0 grow py-2 pl-2 overflow-x-auto overflow-y-hidden flex whitespace-nowrap'>
      {variant.images.map((image, index) => (
        <li key={image.id} className='aspect-product h-full pr-2'>
          <div className='bg-gray-100 dark:bg-gray-900 w-full h-full overflow-hidden'>
            <Image
              className='h-full w-full object-cover'
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
          </div>
        </li>
      ))}
    </ol>
  )
}
