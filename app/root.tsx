import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUser } from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

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

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html lang='en' className='h-full'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
