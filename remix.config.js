/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_dev: true,
  },
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: [
    // TODO figure out why I need to do this; why can't Vercel just include
    // these in the `node_modules` and resolve them normally? I'm guessing this
    // is because `sanitize-html` uses `require()` and not `import` (and thus it
    // is not recognized by Vercel's Edge Runtime).
    // @see {@link https://vercel.com/docs/functions/edge-functions/edge-runtime#unsupported-apis}
    'sanitize-html',
    'htmlparser2',
    'escape-string-regexp',
    'is-plain-object',
    'deepmerge',
    'parse-srcset',
    'postcss',
    // TODO why did I have to mark `nanoid` as a server dependency?
    'nanoid/non-secure',
    // TODO why can't the D3 packages be resolved normally?
    /d3-.*/,
  ],
  images: {
    sizes: [200, 300, 400, 500, 600, 700, 800, 900, 1000],
    domains: ['aritzia.scene7.com'],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
}
