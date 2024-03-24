import { useLoaderData, useNavigate } from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'
import {
  MoreHorizontal,
  Bookmark,
  Send,
  Heart,
  MessageCircle,
} from 'lucide-react'
import { type FC } from 'react'

import { Avatar } from 'components/avatar'
import { Dialog } from 'components/dialog'
import { Image } from 'components/image'
import { ImageItem } from 'components/image-item'
import { LayoutSection } from 'components/layout'
import { TimeAgo } from 'components/time-ago'
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
  const nav = useNavigate()
  return (
    <Dialog
      open
      onOpenChange={() => nav('..', { preventScrollReset: true })}
      className='flex w-max'
    >
      <a
        href={post.url}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Open original post'
        className='aspect-square bg-gray-100 dark:bg-gray-900 grow shrink min-h-[450px] max-w-[800px] max-h-[800px]'
      >
        <Image
          src={post.images[0]?.url}
          alt=''
          className='w-full h-full object-cover'
        />
      </a>
      <div className='grow shrink-[2] min-w-[405px] max-w-[500px] flex flex-col'>
        <header className='flex items-center gap-2 p-4 justify-between border-b flex-none border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-2'>
            <Avatar src={post.author} />
            <div>
              <h1 className='text-sm font-medium'>{post.author.username}</h1>
              <p className='text-2xs text-gray-500'>{post.author.name}</p>
            </div>
          </div>
          <Button size='icon' variant='ghost'>
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </header>
        <div className='h-0 grow overflow-y-auto'>
          <Items />
          <LayoutSection header='Products'>
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
          </LayoutSection>
          <LayoutSection header='Looks'>
            <ol className='grid grid-cols-2 gap-1'>
              {post.looks.map((look) => (
                <ImageItem
                  key={look.id}
                  className='aspect-person'
                  to={`/collections/${look.collectionId}`}
                  image={look.images[0]?.url}
                />
              ))}
            </ol>
          </LayoutSection>
        </div>
        <div className='flex-none p-2 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center'>
              <IconButtonLink label='Like' url={post.url} icon={Heart} />
              <IconButtonLink
                label='Comment'
                url={post.url}
                icon={MessageCircle}
              />
              <IconButtonLink label='Share' url={post.url} icon={Send} />
            </div>
            <IconButtonLink label='Save' url={post.url} icon={Bookmark} />
          </div>
          <TimeAgo
            datetime={post.createdAt}
            className='text-3xs text-gray-500 uppercase p-2'
          />
        </div>
      </div>
    </Dialog>
  )
}

function Items() {
  const post = useLoaderData<typeof loader>()
  return (
    <LayoutSection header='Items'>
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
    </LayoutSection>
  )
}

function IconButtonLink({
  url,
  icon: Icon,
  label,
}: {
  url: string
  icon: FC<{ className?: string }>
  label: string
}) {
  return (
    <a
      href={url}
      aria-label={label}
      target='_blank'
      rel='noopener noreferrer'
      className='hover:opacity-50 transition-colors p-2'
    >
      <Icon className='w-6 h-6' />
    </a>
  )
}
