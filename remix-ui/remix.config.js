/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: ['nanoid/non-secure', /d3-.*/],
  images: {
    sizes: [200, 300, 400, 500, 600, 700, 800, 900, 1000],
    domains: ['aritzia.scene7.com'],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
}
