import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import type { ReactNode } from 'react';
import { StrictMode } from 'react';
import type { ThrownResponse } from '@remix-run/react';
import cn from 'classnames';
import { json } from '@remix-run/node';

import {
  Theme,
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  isTheme,
  useTheme,
} from '~/theme';
import { getSession, getUser, sessionStorage } from '~/session.server';
import Empty from '~/components/empty';
import ThemeSwitcher from '~/components/theme-switcher';
import type { User } from '~/models/user.server';
import tailwindStylesheetUrl from '~/styles/tailwind.css';

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
  { rel: 'stylesheet', href: '/fonts.css' },
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Notes',
  viewport: 'width=device-width,initial-scale=1',
});

export type LoaderData = { user: User | null; theme: Theme | null };

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const theme = session.get('theme') as Theme | null;
  const headers = { 'Set-Cookie': await sessionStorage.commitSession(session) };
  return json<LoaderData>(
    {
      user: await getUser(request),
      theme: isTheme(theme) ? theme : null,
    },
    { headers }
  );
};

function App({ data, children }: { data?: LoaderData; children: ReactNode }) {
  const [theme] = useTheme();
  return (
    <html lang='en' className={cn('h-full', theme)}>
      <head>
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data?.theme)} />
      </head>
      <body className='h-full w-full overflow-hidden bg-white text-gray-900 selection:bg-gray-200 selection:text-black dark:bg-gray-900 dark:text-gray-100 dark:selection:bg-gray-700 dark:selection:text-gray-100'>
        {children}
        <ThemeBody ssrTheme={Boolean(data?.theme)} />
        <div className='fixed top-8 right-8'>
          <ThemeSwitcher />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function ErrorDisplay({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <ThemeProvider specifiedTheme={null}>
        <App>
          <div className='h-screen w-screen p-6'>
            <Empty className='h-full w-full'>
              <article className='max-w-md'>
                {children}
                <p>
                  Try{' '}
                  <Link className='underline' to='/login'>
                    logging in
                  </Link>{' '}
                  again. Or smash your keyboard; that sometimes helps. If you
                  still have trouble, come and complain in{' '}
                  <a
                    className='underline'
                    href='https://numbersstationgroup.slack.com'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    our Slack workspace
                  </a>
                  ; we’re always more than happy to help.
                </p>
              </article>
            </Empty>
          </div>
        </App>
      </ThemeProvider>
    </StrictMode>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorDisplay>
      <p>An unexpected runtime error occurred:</p>
      <div className='my-4 overflow-auto rounded-md bg-gray-100 dark:bg-gray-800'>
        <pre className='w-fit p-4 text-left'>
          <code>{error.message}</code>
          <br />
          <code dangerouslySetInnerHTML={{ __html: error.stack ?? '' }} />
        </pre>
      </div>
    </ErrorDisplay>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, string>>();
  return (
    <ErrorDisplay>
      <p>
        An unexpected{' '}
        <a
          href={`https://httpstatuses.io/${caught.status}`}
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          HTTP {caught.status}
        </a>{' '}
        error occurred:
      </p>
      <div className='my-4 overflow-auto rounded-md bg-gray-100 dark:bg-gray-800'>
        <pre className='w-fit p-4 text-left'>
          <code>
            {caught.status} {caught.statusText}
          </code>
          <br />
          <code dangerouslySetInnerHTML={{ __html: caught.data }} />
        </pre>
      </div>
    </ErrorDisplay>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();
  return (
    <StrictMode>
      <ThemeProvider specifiedTheme={data.theme}>
        <App data={data}>
          <Outlet />
        </App>
      </ThemeProvider>
    </StrictMode>
  );
}
