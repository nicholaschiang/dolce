import { useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'
import { MoreHorizontal } from 'lucide-react'
import { type PropsWithChildren } from 'react'

import { Avatar } from 'components/avatar'
import { ImageItem } from 'components/image-item'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'

import { prisma } from 'db.server'

export async function loader({ params }: DataFunctionArgs) {
  const postId = Number(params.postId)
  if (Number.isNaN(postId)) throw new Response('Not Found', { status: 404 })
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      items: { include: { colors: true, styles: true } },
      products: {
        include: { variants: { include: { images: { take: 1 } }, take: 1 } },
      },
      variants: { include: { product: true, images: { take: 1 } } },
      looks: { include: { images: { take: 1 } } },
      author: true,
      images: true,
    },
  })
  if (post == null) throw new Response('Not Found', { status: 404 })
  return post
}

export default function PostPage() {
  const post = useLoaderData<typeof loader>()
  return (
    <div className='flex'>
      <a
        href={post.url}
        target='_blank'
        rel='noopener noreferrer'
        className='aspect-person bg-gray-100 dark:bg-gray-900'
      >
        <img
          src={post.images[0]?.url}
          alt=''
          className='w-full h-full object-cover'
        />
      </a>
      <div>
        <header className='flex items-center gap-2 justify-between border-b border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-2'>
            <Avatar src={post.author} />
            <h1>{post.author.name}</h1>
          </div>
          <Button size='icon' variant='ghost'>
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </header>
        <Section header='Items'>
          <ol>
            {post.items.map((item) => (
              <li key={item.id}>
                {item.colors.map((color) => (
                  <Badge>{color.name}</Badge>
                ))}
                {item.styles.map((style) => (
                  <Badge>{style.name}</Badge>
                ))}
              </li>
            ))}
          </ol>
        </Section>
        <Section header='Products'>
          <ol className='grid grid-cols-2 gap-1'>
            {post.products.map((product) => (
              <ImageItem
                key={product.id}
                className='aspect-product'
                to={`/products/${product.slug}/variants/${product.variants[0]?.id}`}
                image={product.variants[0]?.images[0]?.url}
              />
            ))}
            {post.variants.map((variant) => (
              <ImageItem
                key={variant.id}
                className='aspect-product'
                to={`/products/${variant.product.slug}/${variant.id}`}
                image={variant.images[0]?.url}
              />
            ))}
          </ol>
        </Section>
        <Section header='Looks'>
          <ol className='grid grid-cols-2 gap-1'>
            {post.looks.map((look) => (
              <ImageItem
                key={look.id}
                to={`/shows/${look.showId}`}
                image={look.images[0]?.url}
              />
            ))}
          </ol>
        </Section>
      </div>
    </div>
  )
}

function Section({ header, children }: PropsWithChildren<{ header: string }>) {
  return (
    <section>
      <h2>{header}</h2>
      {children}
    </section>
  )
}
