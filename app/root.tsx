import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
  useNavigation,
  useNavigationType,
  type RouteMatch,
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'
import {
  type SerializeFrom,
  type LinksFunction,
  type LoaderArgs,
  type V2_MetaFunction,
  json,
} from '@vercel/remix'
import cn from 'classnames'
import NProgress from 'nprogress'
import { type ReactNode, useEffect } from 'react'

import tailwindStylesheetUrl from 'styles/tailwind.css'

import { getSession, getUser, sessionStorage } from 'session.server'
import {
  Theme,
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  isTheme,
  useTheme,
} from 'theme'
import { NAME } from 'utils'

export type Handle = { breadcrumb: (match: RouteMatch) => ReactNode }

export const handle: Handle = {
  breadcrumb: () => (
    <Link prefetch='intent' to='/'>
      dolce
    </Link>
  ),
}

export const config = { runtime: 'edge' }

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: '/fonts/inter-latin-ext.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/inter-latin.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/hack-regular-subset.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/hack-regular-subset.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/hack-bold-subset.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/hack-italic-subset.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/hack-bolditalic-subset.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/bodoni-moda-latin-ext.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/bodoni-moda-latin.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  { rel: 'preload', href: '/fonts/inter.css', as: 'style' },
  { rel: 'preload', href: '/fonts/hack-subset.css', as: 'style' },
  { rel: 'preload', href: '/fonts/bodoni-moda.css', as: 'style' },
  { rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
  { rel: 'stylesheet', href: '/fonts/inter.css' },
  { rel: 'stylesheet', href: '/fonts/hack-subset.css' },
  { rel: 'stylesheet', href: '/fonts/bodoni-moda.css' },
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest' },
]

export const meta: V2_MetaFunction = () => [{ title: NAME }]

type Env = { VERCEL_ANALYTICS_ID?: string }

declare global {
  interface Window {
    env: Env
  }
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request)
  const theme = session.get('theme') as Theme | null
  const headers = { 'Set-Cookie': await sessionStorage.commitSession(session) }
  return json(
    {
      user: await getUser(request),
      theme: isTheme(theme) ? theme : null,
      env: { VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID },
    },
    { headers },
  )
}

export type LoaderData = SerializeFrom<typeof loader>

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error))
    return (
      <ErrorDisplay>
        <code>
          <a
            href={`https://httpstatuses.io/${error.status}`}
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            {error.status} {error.statusText}
          </a>
        </code>
        <br />
        <code dangerouslySetInnerHTML={{ __html: String(error.data) }} />
      </ErrorDisplay>
    )
  if (error instanceof Error)
    return (
      <ErrorDisplay>
        <code>{error.message}</code>
        <br />
        <code dangerouslySetInnerHTML={{ __html: error.stack ?? '' }} />
      </ErrorDisplay>
    )
  return (
    <ErrorDisplay>
      <code>An unexpected runtime error ocurred</code>
    </ErrorDisplay>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App data={data}>
        <Outlet />
      </App>
    </ThemeProvider>
  )
}

function App({ data, children }: { data?: LoaderData; children: ReactNode }) {
  const [theme] = useTheme()
  const type = useNavigationType()
  const navigation = useNavigation()
  useEffect(() => {
    // when the state is idle then we can complete the progress bar
    if (navigation.state === 'idle') NProgress.done()
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else if (type !== 'REPLACE') {
      const timeoutId = setTimeout(() => NProgress.start(), 100)
      return () => clearTimeout(timeoutId)
    }
  }, [navigation.state, type])
  return (
    <html lang='en' className={cn('h-full', theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='referrer' content='no-referrer' />
        <meta name='author' content={NAME} />
        <meta name='copyright' content={`Copyright (c) ${NAME} 2023`} />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data?.theme)} />
      </head>
      <body className='bg-white text-gray-900 selection:bg-gray-200 selection:text-gray-900 dark:bg-gray-950 dark:text-gray-50 dark:selection:bg-gray-800 dark:selection:text-gray-50'>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data?.env ?? {})}`,
          }}
        />
        <Analytics />
        <ThemeBody ssrTheme={Boolean(data?.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function ErrorDisplay({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider specifiedTheme={null}>
      <App>
        <div className='flex h-screen w-screen items-center justify-center p-6 text-gray-900/25 dark:text-gray-100/25'>
          <article className='max-h-full'>
            <p>
              An unexpected runtime error occurred. Try{' '}
              <Link className='underline' to='/login'>
                authenticating
              </Link>
              . Or smash your keyboard—that can help.
            </p>
            <div className='mt-4 w-0 min-w-full max-w-full overflow-auto bg-gray-100 dark:bg-gray-800'>
              <pre className='w-fit p-6 text-xs leading-4'>{children}</pre>
            </div>
          </article>
        </div>
      </App>
    </ThemeProvider>
  )
}
