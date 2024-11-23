import { Outlet, Link, useLoaderData, useFetcher } from '@remix-run/react'
import { type LoaderFunctionArgs, type SerializeFrom } from '@vercel/remix'
import { Minus, PanelRightClose, PanelRightOpen } from 'lucide-react'
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

import { type Product } from 'routes/_wardrobe.products._index'

import { Avatar } from 'components/avatar'
import { Empty } from 'components/empty'
import {
  HeaderWrapper,
  HeaderActions,
  HeaderBreadcrumbs,
} from 'components/header'
import {
  Layout,
  LayoutLeft,
  LayoutRight,
  LayoutDivider,
} from 'components/layout'
import { badgeVariants } from 'components/ui/badge'
import { Button } from 'components/ui/button'

import { cn } from 'utils/cn'
import { getCollectionSeason } from 'utils/collection'
import { useUser, useOptionalUser } from 'utils/general'
import { OWN_SET_NAME } from 'utils/set'

import { prisma } from 'db.server'
import { getUserId } from 'session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId == null) return []
  const looks = await prisma.look.findMany({
    where: { boards: { some: { name: OWN_SET_NAME, authorId: userId } } },
    include: {
      author: true,
      images: true,
      products: { include: { variants: { include: { images: true } } } },
      boards: { include: { author: true } },
      collection: { include: { season: true, brand: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return looks
}

type ProductsContextT = [Product[], Dispatch<SetStateAction<Product[]>>]
const ProductsContext = createContext<ProductsContextT>([[], () => {}])
export const useProducts = () => useContext(ProductsContext)

type SidebarOpenContextT = [boolean, Dispatch<SetStateAction<boolean>>]
const SidebarOpenContext = createContext<SidebarOpenContextT>([false, () => {}])
const useSidebarOpen = () => useContext(SidebarOpenContext)

// Wardrobe sidebar UI to allow users to save pieces to looks and curate their
// library of saved collections, products, and looks (their "wardrobe" per se).
//
// Right now, this is very rudimentary, but I'm keeping the code paths around as
// they'll probably be a useful starting point for when I spend time to actually
// make this "wardrobe" feature set useful.
//
// Users can always collapse this panel. It will remain collapsed by default and
// the open state will be persisted in localStorage.
export default function WardrobePage() {
  const user = useOptionalUser()
  const sidebarOpenState = useState(false)
  return (
    <SidebarOpenContext.Provider value={sidebarOpenState}>
      <ProductsContext.Provider value={useState<Product[]>([])}>
        <Layout className='h-auto fixed inset-0'>
          <LayoutLeft>
            <Content />
          </LayoutLeft>
          {sidebarOpenState[0] === true && user != null && (
            <>
              <LayoutDivider />
              <LayoutRight className='flex flex-col'>
                <WardrobeHeader />
                <Looks />
              </LayoutRight>
            </>
          )}
        </Layout>
      </ProductsContext.Provider>
    </SidebarOpenContext.Provider>
  )
}

function Content() {
  const user = useOptionalUser()
  return (
    <main className='h-full flex flex-col overflow-hidden'>
      <HeaderWrapper className='flex-none'>
        <HeaderBreadcrumbs />
        <HeaderActions>{user != null && <SidebarToggleButton />}</HeaderActions>
      </HeaderWrapper>
      <Outlet />
    </main>
  )
}

function SidebarToggleButton() {
  const [sidebarOpen, setSidebarOpen] = useSidebarOpen()
  return (
    <Button
      size='icon'
      variant='ghost'
      aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      onClick={() => setSidebarOpen((open) => !open)}
    >
      {sidebarOpen ? (
        <PanelRightClose className='w-3 h-3' />
      ) : (
        <PanelRightOpen className='w-3 h-3' />
      )}
    </Button>
  )
}

function WardrobeHeader() {
  return (
    <header className='p-3 border-b border-gray-200 dark:border-gray-800'>
      <h2 className='leading-none'>Your wardrobe</h2>
      <p className='text-gray-400 dark:text-gray-500'>
        Add products and looks to your wardrobe
      </p>
    </header>
  )
}

function Looks() {
  const looks = useLoaderData<typeof loader>()
  return (
    <div className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ul className='grid grid-cols-2 gap-2 p-2'>
        <CreateItem />
        {looks.map((look) => (
          <LookItem key={look.id} look={look} />
        ))}
      </ul>
    </div>
  )
}

function CreateItem() {
  const fetcher = useFetcher()
  const [products, setProducts] = useContext(ProductsContext)
  const user = useUser()
  return (
    <fetcher.Form
      action='/api/looks'
      method='post'
      className='border border-gray-200 dark:border-gray-800 rounded-md col-span-2 bg-white dark:bg-gray-950'
    >
      <div className='p-2 flex items-center gap-1'>
        <Avatar className='h-6 w-6 text-3xs' src={user} />
        <strong className='font-medium text-xs'>{user.username}</strong>
      </div>
      <ul className='grid grid-cols-3 relative'>
        {products.length === 0 && (
          <>
            <li className='w-full aspect-product' />
            <Empty className='absolute inset-2 h-auto'>Select products</Empty>
          </>
        )}
        {products.map((product) => (
          <li
            key={product.id}
            className='w-full aspect-product bg-gray-100 dark:bg-gray-900 relative group'
          >
            <Button
              className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
              size='icon'
              onClick={() =>
                setProducts((prev) => {
                  const idx = prev.findIndex((p) => p.id === product.id)
                  return [...prev.slice(idx), ...prev.slice(idx + 1)]
                })
              }
            >
              <Minus className='w-3 h-3' />
            </Button>
            <img
              src={product.variants[0].images[0].url}
              alt=''
              className='object-cover h-full w-full'
            />
          </li>
        ))}
      </ul>
      {products.map((p) => (
        <input type='hidden' name='productId' value={p.id} />
      ))}
      <div className='flex gap-2 p-2 justify-end'>
        <Button size='sm' variant='ghost'>
          Cancel
        </Button>
        <Button
          size='sm'
          type='submit'
          variant='outline'
          disabled={fetcher.state !== 'idle'}
        >
          Save
        </Button>
      </div>
    </fetcher.Form>
  )
}

type Look = SerializeFrom<typeof loader>[number]

function LookItem({ look }: { look: Look }) {
  const username = look.author?.username ?? look.collection?.brand?.slug
  const description = look.collection
    ? `${getCollectionSeason(look.collection)} Look ${look.number}`
    : `Look ${look.number}`
  return (
    <li className='rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs'>
      <div className='p-2 flex items-center gap-1'>
        <Avatar
          className='h-6 w-6 text-3xs'
          src={look.author ?? look.collection?.brand}
        />
        <strong className='font-medium'>{username}</strong>
      </div>
      <div className='w-full aspect-person bg-gray-100 dark:bg-gray-900 overflow-y-auto overflow-x-hidden'>
        {look.images.length ? (
          <img
            className='w-full h-full object-cover'
            src={look.images[0].url}
            alt=''
          />
        ) : (
          look.products
            .filter((p) => p.variants.flatMap((v) => v.images).length)
            .map((p) => (
              <div className='aspect-product w-full'>
                <img
                  className='w-full h-full object-cover'
                  src={p.variants[0].images[0].url}
                  alt=''
                />
              </div>
            ))
        )}
      </div>
      <div className='p-2 flex flex-col gap-2'>
        <p className='truncate'>
          <strong className='font-medium'>{username}</strong> {description}
        </p>
        <ul className='flex flex-wrap gap-1'>
          {look.boards.map((set) => (
            <SetItem key={set.id} set={set} />
          ))}
        </ul>
      </div>
    </li>
  )
}

type Set = SerializeFrom<typeof loader>[number]['boards'][number]

function SetItem({ set }: { set: Set }) {
  return (
    <Link
      to={`/${set.author.username}/sets/${set.id}`}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(badgeVariants({ variant: 'outline' }), 'gap-1')}
    >
      <div className='rounded-full w-2 h-2 bg-violet-600' />
      <span>{set.name}</span>
    </Link>
  )
}
