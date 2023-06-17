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
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'
import {
  type LinksFunction,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@vercel/remix'
import { json } from '@vercel/remix'
import cn from 'classnames'
import { type ReactNode } from 'react'

import { type User } from 'models/user.server'

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

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: '/fonts/875712e3-9c93-4f0b-a46a-a278e69a71f6.woff',
    crossOrigin: 'anonymous',
    type: 'font/woff',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/a1c4330f-ba73-4f1f-aa05-bd237c58ba51.woff',
    crossOrigin: 'anonymous',
    type: 'font/woff',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/TE20L-0A212F48-0D4B-43DA-A24C-F36D66965FA4.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/TE20T-0A212F48-0D4B-43DA-A24C-F36D66965FA4.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/TE40L-0A212F48-0D4B-43DA-A24C-F36D66965FA4.woff2',
    crossOrigin: 'anonymous',
    type: 'font/woff2',
    as: 'font',
  },
  {
    rel: 'preload',
    href: '/fonts/TE40T-0A212F48-0D4B-43DA-A24C-F36D66965FA4.woff2',
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
  { rel: 'preload', href: '/fonts/univers.css', as: 'style' },
  { rel: 'preload', href: '/fonts/hack-subset.css', as: 'style' },
  { rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
  { rel: 'stylesheet', href: '/fonts/univers.css' },
  { rel: 'stylesheet', href: '/fonts/hack-subset.css' },
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
]

export const meta: V2_MetaFunction = () => [
  { charSet: 'utf-8' },
  { title: 'nicholas engineering' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
]

type Env = { VERCEL_ANALYTICS_ID?: string }

declare global {
  interface Window {
    env: Env
  }
}

export type LoaderData = { user: User | null; theme: Theme | null; env: Env }

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request)
  const theme = session.get('theme') as Theme | null
  const headers = { 'Set-Cookie': await sessionStorage.commitSession(session) }
  return json<LoaderData>(
    {
      user: await getUser(request),
      theme: isTheme(theme) ? theme : null,
      env: { VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID },
    },
    { headers },
  )
}

function App({ data, children }: { data?: LoaderData; children: ReactNode }) {
  const [theme] = useTheme()
  return (
    <html lang='en' className={cn('h-full', theme)}>
      <head>
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data?.theme)} />
      </head>
      <body className='bg-white text-gray-900 selection:bg-gray-200 selection:text-black dark:bg-gray-900 dark:text-gray-100 dark:selection:bg-gray-700 dark:selection:text-gray-100'>
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
              . Or smash your keyboard—that can help. You can also{' '}
              <a
                className='underline'
                href='https://github.com/nicholaschiang/site/issues/new'
                target='_blank'
                rel='noopener noreferrer'
              >
                file an issue
              </a>
              .
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
  const data = useLoaderData<LoaderData>()
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App data={data}>
        <Outlet />
      </App>
    </ThemeProvider>
  )
}
