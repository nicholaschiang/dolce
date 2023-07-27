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
  serverDependenciesToBundle: ['nanoid/non-secure'],
}
