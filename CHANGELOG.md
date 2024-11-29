# Release Notes

## [1.70.1](https://github.com/nicholaschiang/dolce/compare/v1.70.0...v1.70.1) (2024-11-29)


### Performance Improvements

* **svelte-ui:** create image look index ([29f7187](https://github.com/nicholaschiang/dolce/commit/29f7187405c93630782dff76bf7094053c42b861))

## [1.70.0](https://github.com/nicholaschiang/dolce/compare/v1.69.0...v1.70.0) (2024-11-25)


### Features

* use neon for managed postgres in production ([a6357ba](https://github.com/nicholaschiang/dolce/commit/a6357ba94cd0d38a1bb675ccb9610d012d8d8c77))

## [1.69.0](https://github.com/nicholaschiang/dolce/compare/v1.68.4...v1.69.0) (2024-11-25)


### Features

* **svelte-ui:** add `drizzle` ORM for db access ([de25465](https://github.com/nicholaschiang/dolce/commit/de25465eeea6f8021147827fa63b6d9f6f8dfc79))
* **svelte-ui:** add basic collections grid ([b651465](https://github.com/nicholaschiang/dolce/commit/b6514652ffe1be110ebf9e741efa9b5e85d0d0e0))
* **svelte-ui:** add basic collections list page ([af52777](https://github.com/nicholaschiang/dolce/commit/af527775980e901f1d67bab6edbc6ed68f3df7f7)), closes [/orm.drizzle.team/docs/get-started/postgresql-existing#step-4](https://github.com/nicholaschiang//orm.drizzle.team/docs/get-started/postgresql-existing/issues/step-4)
* **svelte-ui:** add collection specific page ([9abd0fc](https://github.com/nicholaschiang/dolce/commit/9abd0fcf04de56c1c7438bf20b39d10db2181f11))
* **svelte-ui:** initialize empty SvelteKit project ([e50c08f](https://github.com/nicholaschiang/dolce/commit/e50c08f214eb8ab89c84799e4e7c8add0b36d1ef))


### Performance Improvements

* **svelte-ui:** use drizzle select API ([2e94f53](https://github.com/nicholaschiang/dolce/commit/2e94f53841ebab32bb34e62b47fb2a7d74203749))

## [1.68.4](https://github.com/nicholaschiang/dolce/compare/v1.68.3...v1.68.4) (2024-11-23)


### Bug Fixes

* run semantic release from repository root ([057d3d9](https://github.com/nicholaschiang/dolce/commit/057d3d985d5290c198155c61a9e99165ab6e8f44))

## [1.68.0](https://github.com/nicholaschiang/dolce/compare/v1.67.0...v1.68.0) (2024-11-23)


### Features

* log raw SQL queries when in debug mode ([f825bba](https://github.com/nicholaschiang/dolce/commit/f825bbaffe4cfd30c7bb4c0662cbe96d0967f820))


### Bug Fixes

* correct "show yet" empty messages ([0b52f15](https://github.com/nicholaschiang/dolce/commit/0b52f151f33c1b5d2efaa5a6e7782a4fa71f2f85))
* hide products field from filter menu ([733e245](https://github.com/nicholaschiang/dolce/commit/733e2457b6d3d0fc638a7d2f72a56b95e4992965))
* hide shows from collections filter menu ([c918de4](https://github.com/nicholaschiang/dolce/commit/c918de4e27a8b521a2c33b111e6287c518b7cfb9))

## [1.67.0](https://github.com/nicholaschiang/dolce/compare/v1.66.0...v1.67.0) (2024-03-24)


### Features

* **prisma:** replace shows with collections ([2ca2c60](https://github.com/nicholaschiang/dolce/commit/2ca2c601ee5770a90889db20d0f1bc6cc2006df9))


### Bug Fixes

* **app:** replace shows with collection pages ([c4ec886](https://github.com/nicholaschiang/dolce/commit/c4ec886c40b5ab5d69142b5f8c64663dcd668a88))

## [1.66.0](https://github.com/nicholaschiang/dolce/compare/v1.65.1...v1.66.0) (2024-02-25)


### Features

* **app/filters:** allow filter on variant tags ([0ef6db8](https://github.com/nicholaschiang/dolce/commit/0ef6db8d23a8c78935b762ad6e68fcbe745afbcb))


### Bug Fixes

* **app/components/menu:** scroll through long list ([3e2752a](https://github.com/nicholaschiang/dolce/commit/3e2752a903a16ca4c7cc01b6182b3c28a95cd131))

## [1.65.1](https://github.com/nicholaschiang/dolce/compare/v1.65.0...v1.65.1) (2024-02-25)


### Bug Fixes

* **app/routes/brands:** link to brand products ([3eabca7](https://github.com/nicholaschiang/dolce/commit/3eabca728354bd56173f42d461c5a3a567abd943))

## [1.65.0](https://github.com/nicholaschiang/dolce/compare/v1.64.0...v1.65.0) (2024-02-25)


### Features

* **app:** add wardrobe panel open/close button ([8f6f567](https://github.com/nicholaschiang/dolce/commit/8f6f5673b8a41de6b981d2bea70279d3258309ea))

## [1.64.0](https://github.com/nicholaschiang/dolce/compare/v1.63.0...v1.64.0) (2024-02-25)


### Features

* **app/posts:** style posts UI after Instagram ([6d1f896](https://github.com/nicholaschiang/dolce/commit/6d1f896670500c4b19d6a1ba9d78a8fa47a342e6))
* **app:** add new user-scoped posts UI ([c9ed403](https://github.com/nicholaschiang/dolce/commit/c9ed403854da7b8187cf1cd43806e85e5c722719))
* **prisma/schema:** add posts and items data model ([e2a0aaf](https://github.com/nicholaschiang/dolce/commit/e2a0aafb7cd7ec068a2ab6e611e0800dd326f34c))
* **scripts/node:** import posts from Instagram ([a7b065e](https://github.com/nicholaschiang/dolce/commit/a7b065e4fdaffacfebe90e8be11bf5dd8c6d6f64))


### Bug Fixes

* **app/filters:** add new relation filter types ([e684b83](https://github.com/nicholaschiang/dolce/commit/e684b83ba550c08a1172c525f0687ec88bb6b40f))
* **app/product:** users can always change colors ([b95f8f3](https://github.com/nicholaschiang/dolce/commit/b95f8f313e6fd26181605b505f42062ae4d2b333))
* **app/root:** do not use edge runtime for now ([3eb4627](https://github.com/nicholaschiang/dolce/commit/3eb462751d59005c3de8eb57830ef121d25defc1))
* **app:** update `[@conform-to](https://github.com/conform-to)` package usage ([6ed4be2](https://github.com/nicholaschiang/dolce/commit/6ed4be262e8538b1e80efcaa346bdbf2a63a5f85))

## [1.63.0](https://github.com/nicholaschiang/dolce/compare/v1.62.4...v1.63.0) (2023-12-21)


### Features

* add jupyter notebooks for experimentation ([6ac4aa1](https://github.com/nicholaschiang/dolce/commit/6ac4aa1aad8f8bc570564a456036346845ce733d))
* **prisma:** rename "set" model to "board" ([94273fb](https://github.com/nicholaschiang/dolce/commit/94273fbb8f8f824567c404f2b677aa8c13ab56c5))


### Bug Fixes

* **app:** replace `Set` data model with `Board` ([88ddb27](https://github.com/nicholaschiang/dolce/commit/88ddb27cedd4461a9a607015d71c46909a44570b))

## [1.62.4](https://github.com/nicholaschiang/dolce/compare/v1.62.3...v1.62.4) (2023-12-21)


### Bug Fixes

* **app/infinite-list:** add `initialRect` for SSR ([3e5d96c](https://github.com/nicholaschiang/dolce/commit/3e5d96c031fb6aaec66fa360ca1d16d523ed3230))

## [1.62.3](https://github.com/nicholaschiang/dolce/compare/v1.62.2...v1.62.3) (2023-12-21)


### Bug Fixes

* **app/filters:** add text label to "+" button ([c3c49be](https://github.com/nicholaschiang/dolce/commit/c3c49be905fe285edea2968c34ef84f9696ecb04))
* **app/root:** update `FullStory` API usage ([d3ffd94](https://github.com/nicholaschiang/dolce/commit/d3ffd94ca9e9e191bac5121f5fcbd3bf809455ec)), closes [fullstory/browser#migrating-to-version-2](https://github.com/fullstory/browser/issues/migrating-to-version-2)

## [1.62.2](https://github.com/nicholaschiang/dolce/compare/v1.62.1...v1.62.2) (2023-12-21)


### Bug Fixes

* **app/profile:** own/want nav items go to sets ([1d8ddb0](https://github.com/nicholaschiang/dolce/commit/1d8ddb0d75d4a6b10197c7fba051c6feda573978))
* **image:** always proxy images through API route ([ca027a1](https://github.com/nicholaschiang/dolce/commit/ca027a164b3141954524152a0f7df7f0961ffc44))

## [1.62.1](https://github.com/nicholaschiang/dolce/compare/v1.62.0...v1.62.1) (2023-11-23)


### Bug Fixes

* **model/user.server:** remove `console.log` ([34f7a26](https://github.com/nicholaschiang/dolce/commit/34f7a2641158d205fab5911658493ff74951274d))
* **products:** hide "add" button when not logged in ([32e3058](https://github.com/nicholaschiang/dolce/commit/32e305842bafd7b162b8da21b31fdbc20e365f02))
* **wardrobe:** hide wardrobe when not logged in ([b218470](https://github.com/nicholaschiang/dolce/commit/b2184706f2cb475334fca06ed86df628927eb108))

## [1.62.0](https://github.com/nicholaschiang/dolce/compare/v1.61.0...v1.62.0) (2023-11-08)


### Features

* **app:** add persistent wardrobe sidebar ([76d9e2b](https://github.com/nicholaschiang/dolce/commit/76d9e2b6ba7461c11f76ff1fe62cb9ddaae8a3bf))
* **app:** create separate "want" and "own" pages ([c5047ff](https://github.com/nicholaschiang/dolce/commit/c5047ffc7f0031188caf770677686ee35d11d91e))
* **prisma:** users can create looks without shows ([2f31a1a](https://github.com/nicholaschiang/dolce/commit/2f31a1ad0060788fe47839aff234a35aafb84de5))
* **wardrobe:** add product saving buttons ([7b6dc09](https://github.com/nicholaschiang/dolce/commit/7b6dc098edd45fa4fcb0210dd86ec8976c8fe67e))


### Bug Fixes

* **scripts/save/shopify:** log errors in one line ([6329a29](https://github.com/nicholaschiang/dolce/commit/6329a293de775a5c54d4af621da381bdc8628a12))

## [1.61.0](https://github.com/nicholaschiang/dolce/compare/v1.60.0...v1.61.0) (2023-10-02)


### Features

* **prisma:** save shopify tags on product variants ([b6144eb](https://github.com/nicholaschiang/dolce/commit/b6144eb2817cb5b41042bab43af30463ba5f2011))


### Bug Fixes

* **scripts/save/shopify:** save variant tags to db ([c9e9b58](https://github.com/nicholaschiang/dolce/commit/c9e9b58e1c20ea8241d521eddf77bd15c0d3c4db))

## [1.60.0](https://github.com/nicholaschiang/dolce/compare/v1.59.0...v1.60.0) (2023-10-01)


### Features

* **routes:** only show banner on home page ([ccabeaa](https://github.com/nicholaschiang/dolce/commit/ccabeaa355db11815fc51fb32a17ac81c67cee4e))

## [1.59.0](https://github.com/nicholaschiang/dolce/compare/v1.58.0...v1.59.0) (2023-10-01)


### Features

* allow users to save products to sets ([04a318b](https://github.com/nicholaschiang/dolce/commit/04a318b470d91b57b75da54233908c9ad6a5fd2a))
* **prisma:** products can be added to sets too ([85fb410](https://github.com/nicholaschiang/dolce/commit/85fb41020c63a5a0834d0afe7a58de5061437dcf))
* **products:** add save menu to products list ([0c16631](https://github.com/nicholaschiang/dolce/commit/0c166316ecb78151dd33307b695faaffa7ffc28d))


### Bug Fixes

* **prisma:** save specific product variants to sets ([5caea78](https://github.com/nicholaschiang/dolce/commit/5caea78d02c166e687a7c15c129e78c5bfaa3afd))
* **ui/button:** add background to `ghost` variant ([0904942](https://github.com/nicholaschiang/dolce/commit/090494203a38da4d96d06d6fa04c16d38efcf36a))
* **ui/button:** show expanded state on outlined ([7b7712f](https://github.com/nicholaschiang/dolce/commit/7b7712fb6bdff22e771c3644f4fe7bfae2aeaae0))

## [1.58.0](https://github.com/nicholaschiang/dolce/compare/v1.57.0...v1.58.0) (2023-10-01)


### Features

* **product:** add styles link to properties ([b3855c6](https://github.com/nicholaschiang/dolce/commit/b3855c648c4aa888e604cb6136b9f762f06d01da))
* **products:** show most recently released products ([41050fd](https://github.com/nicholaschiang/dolce/commit/41050fd1c46d8ef27dafcc859350ed11082e26d7))
* **scripts/save/shopify:** import kith products ([9ead2b8](https://github.com/nicholaschiang/dolce/commit/9ead2b819235c65fe38cd7f800ddebc63f4ba87b))
* **show/looks:** clicking on look opens save menu ([2a52b0e](https://github.com/nicholaschiang/dolce/commit/2a52b0e4e3db8a23c48f95a084d366bba7043a11))


### Bug Fixes

* **package.json:** enable manual HMR for now ([63f1706](https://github.com/nicholaschiang/dolce/commit/63f1706430cfe4d69fce5f9dc4f043ba262c3c02))
* **product:** clicking size or color replaces URL ([d14a383](https://github.com/nicholaschiang/dolce/commit/d14a3830c12d0ef08febff19c03b4dd6216758ea))
* **product:** move details below pricing info ([8f2c2f7](https://github.com/nicholaschiang/dolce/commit/8f2c2f729b71259b227fcefd99eff0d1220a5518))
* **product:** round price values in prices section ([8e1cd5b](https://github.com/nicholaschiang/dolce/commit/8e1cd5b59706929ce9ba0a54c2240caa2e72957e))
* **scripts/save/shopify:** skip variants without sku ([84fa8fc](https://github.com/nicholaschiang/dolce/commit/84fa8fc0d404f290b798c992eb47e9f0b94785fe))
* **scripts/save/shopify:** upsert existing products ([3c496b4](https://github.com/nicholaschiang/dolce/commit/3c496b41815785afeae53fa978812f97f55002bc))

## [1.57.0](https://github.com/nicholaschiang/dolce/compare/v1.56.1...v1.57.0) (2023-09-30)


### Features

* **product:** add details section to product ([c0e2584](https://github.com/nicholaschiang/dolce/commit/c0e2584e69ef36ee45376bfc9eaf3b79257ad5e7))
* **product:** make product aside header sticky ([7f6fe00](https://github.com/nicholaschiang/dolce/commit/7f6fe001e8145106034507a949d30fcd1d688aad))
* save all prices and set `available` field ([176b6f1](https://github.com/nicholaschiang/dolce/commit/176b6f157aa2c3a153debc674865f173d9e16ea0))


### Bug Fixes

* **scripts/node/save/shopify:** resolve relative links ([c478722](https://github.com/nicholaschiang/dolce/commit/c4787221c3f46e665d471519adf03e6e359c4850))

## [1.56.1](https://github.com/nicholaschiang/dolce/compare/v1.56.0...v1.56.1) (2023-09-30)


### Bug Fixes

* **app:** address remix breaking changes ([dc40c2c](https://github.com/nicholaschiang/dolce/commit/dc40c2cf864ca74d8898a53c420c9b62486d4437))
* **app:** address TS enum errors ([c575183](https://github.com/nicholaschiang/dolce/commit/c5751836449aa1806a61f10043942399fa5b27b2))
* **cypress/tsconfig:** address some config issues ([17a16ac](https://github.com/nicholaschiang/dolce/commit/17a16ac51c8b84f2d5306f7e124ac75b0190cbaa))
* **routes:** address `[@conform-to](https://github.com/conform-to)` breaking changes ([a8a4eae](https://github.com/nicholaschiang/dolce/commit/a8a4eae3b2ec7dc79a96aa43e41bb4f8e4008858))
* **server:** `installGlobals` in custom server ([413c961](https://github.com/nicholaschiang/dolce/commit/413c96181d01156300a719438fe757068ec4ea79))
* **ui/dialog:** remove `className` from `<Portal>` ([bf0a21a](https://github.com/nicholaschiang/dolce/commit/bf0a21a41bb3761bff6bbd9641ef7b4fd2b2fa38))
* **utils/schema:** surface custom required messages ([b14ac5b](https://github.com/nicholaschiang/dolce/commit/b14ac5b475fc0573335033d8f5d5ae21d7c9cb7e))

## [1.56.0](https://github.com/nicholaschiang/dolce/compare/v1.55.1...v1.56.0) (2023-09-30)


### Features

* **app:** updates for new product data model ([6c413ca](https://github.com/nicholaschiang/dolce/commit/6c413caea7e27fe1af3fde2e5bf092dd58398962))
* **prisma:** update product and variant models ([b14c362](https://github.com/nicholaschiang/dolce/commit/b14c36283a006dd902772aa7aa5e8a18591faf62))
* **product:** reuse show layout in product page ([11c7f66](https://github.com/nicholaschiang/dolce/commit/11c7f66b0834e5aeaeefe4428dae1ecea7beddf0))
* **product:** show prices per variant option ([a1b7f3f](https://github.com/nicholaschiang/dolce/commit/a1b7f3f6e81b7bca52b84bb1ca47b284bdf5a177))
* **products:** move product dialog to separate page ([0998f9c](https://github.com/nicholaschiang/dolce/commit/0998f9c43af73b3fd455d04cf4502e3d72c49717))
* **products:** show lowest price in products list ([4a0ee2d](https://github.com/nicholaschiang/dolce/commit/4a0ee2d2c448808ad855b8cb969d173ea8db46cd))
* **routes/variants:** search variants by color name ([4973e35](https://github.com/nicholaschiang/dolce/commit/4973e35314156c2feed1ba1b107029327acd8fe6))
* **routes:** add new product page with prices ([af084c6](https://github.com/nicholaschiang/dolce/commit/af084c60c10ed04b4700c61c487be23ed2d42972))
* **scripts/node/save:** import shopify products ([6a3dba9](https://github.com/nicholaschiang/dolce/commit/6a3dba908c71eaabbb569542308b56f6c0806dc7))
* **scripts/python/settings:** enable download delay ([0bd9ef5](https://github.com/nicholaschiang/dolce/commit/0bd9ef56746baeff9e9f56067bfb7a66feda0945))
* **scripts:** add spider to scrape Shopify products ([4394504](https://github.com/nicholaschiang/dolce/commit/4394504cf2b134fd0c86f0e148d5c9a344a3a4a6))


### Bug Fixes

* **app/product:** order images by position number ([8a28aa4](https://github.com/nicholaschiang/dolce/commit/8a28aa4f55befd877f729b5b0d2ec7f51c6495e2))
* **app:** move image aspect ratio to constants ([b029e01](https://github.com/nicholaschiang/dolce/commit/b029e01a94ed949423f4c479d22625596e921fcc))
* **components/dialog:** add max height to dialog ([7dd888d](https://github.com/nicholaschiang/dolce/commit/7dd888d7e66669c1976908866f4df2fbad9026b8))
* **filters/variant:** filter for multiple colors ([9423b78](https://github.com/nicholaschiang/dolce/commit/9423b782928480276e679210bacd6aca888c09a6))
* **infinite-list:** increase vertical spacing ([0107432](https://github.com/nicholaschiang/dolce/commit/0107432aa127c3d984fa117f06dc66cddbc821a2))
* **infinite-list:** support nested resizing ([25d5ef7](https://github.com/nicholaschiang/dolce/commit/25d5ef702cde66db34839437320dec0682b522b2))
* **product:** show brand name in product page ([26f60ec](https://github.com/nicholaschiang/dolce/commit/26f60ece3357b398fbc24d0819733efb1f60e4d3))

## [1.55.1](https://github.com/nicholaschiang/dolce/compare/v1.55.0...v1.55.1) (2023-09-02)


### Bug Fixes

* **infinite-list:** wait for mount before scroll ([06e5202](https://github.com/nicholaschiang/dolce/commit/06e5202b0385fd78ee173f9050e156faf52fae89))
* remove `looks` from filterable attributes ([de84e62](https://github.com/nicholaschiang/dolce/commit/de84e6232f64bfa838f781f066c02cdd38624392))

## [1.55.0](https://github.com/nicholaschiang/dolce/compare/v1.54.1...v1.55.0) (2023-09-02)


### Features

* add explanation banner to list pages ([d1366bc](https://github.com/nicholaschiang/dolce/commit/d1366bc9712a2be41094cbfc6f6fc1e597e9e108))
* **index/header:** add links to useful list pages ([3738b19](https://github.com/nicholaschiang/dolce/commit/3738b19dcdb16ac37e0f4b6e8750935f9ce92417))
* **index/header:** link to latest shows season ([7bc1f05](https://github.com/nicholaschiang/dolce/commit/7bc1f053282d539bf37a4f597eb2032b3b176d19))
* **map:** open shows when location name clicked ([93e3d10](https://github.com/nicholaschiang/dolce/commit/93e3d103601bb74b0a0dcb5764833c97233f920c))
* **products:** add "no results" state to list ([bc079a5](https://github.com/nicholaschiang/dolce/commit/bc079a568e0f86dfc41cb9df6b333a3b3daf7149))
* **products:** add infinite scrolling to products ([6abc7a9](https://github.com/nicholaschiang/dolce/commit/6abc7a975d862a1bef2cc2bd6f73060c4ec27871))
* **products:** add variant carousel to products list ([b7b5bde](https://github.com/nicholaschiang/dolce/commit/b7b5bde15f52665ddf47bdfd739b475f33103581))
* reuse item styling for shows and products ([5a08461](https://github.com/nicholaschiang/dolce/commit/5a084615d2a2b2de72d8361bd6f1d28a1ab53f7b))
* **routes/seasons:** link to shows page instead ([2388bfa](https://github.com/nicholaschiang/dolce/commit/2388bfa34e0b138b96dd0a6b33fa7a9ec2ca6558))


### Bug Fixes

* **carousel:** add dark background to pagination dots ([11c023a](https://github.com/nicholaschiang/dolce/commit/11c023a3f7671cd2e6942ef3d87e9fca38f06a6a))
* **carousel:** do not require explicit `itemWidth` ([0fb1420](https://github.com/nicholaschiang/dolce/commit/0fb142094577704431960b0301079ed37650a577))
* **carousel:** remove gradient background ([cc1e4e4](https://github.com/nicholaschiang/dolce/commit/cc1e4e43ad87717d07370dded6212650dd4e9130))
* **components/filters:** remove frosted background ([41109d8](https://github.com/nicholaschiang/dolce/commit/41109d835d0a65efd01819bab761671285440190))
* **index/header:** remove "brands" homepage link ([5958035](https://github.com/nicholaschiang/dolce/commit/5958035988c92314ee6551619b5d44f92269392d))
* **routes/brands:** link to shows page instead ([743a91b](https://github.com/nicholaschiang/dolce/commit/743a91b7bee925993519028df6caa70298b19453))
* save properly capitalized product names ([c170751](https://github.com/nicholaschiang/dolce/commit/c170751c356ae1764cc5f7ebb0244060c5bf761e))
* **show/critic-reviews:** add margin to empty state ([a02d623](https://github.com/nicholaschiang/dolce/commit/a02d62342ae6f70406a4d870370349c704b3dcc2))

## [1.54.1](https://github.com/nicholaschiang/dolce/compare/v1.54.0...v1.54.1) (2023-09-01)


### Performance Improvements

* **shows:** remove unnecessary `collections` join ([447e141](https://github.com/nicholaschiang/dolce/commit/447e1410ef3f80fb6590bbf94cfad126a6349d12))

## [1.54.0](https://github.com/nicholaschiang/dolce/compare/v1.53.0...v1.54.0) (2023-08-21)


### Features

* **show:** make article headers sticky ([7c4c644](https://github.com/nicholaschiang/dolce/commit/7c4c644e8080e42d78736d9c320ab4f53abba3d3))
* **show:** redesign show page to focus on video ([d40f571](https://github.com/nicholaschiang/dolce/commit/d40f5714dc09957b764eb080a84a887242a1a573))


### Bug Fixes

* **show/rate-and-review:** increase form padding ([d52abbe](https://github.com/nicholaschiang/dolce/commit/d52abbe267d863cb3f18231f2a383a1c29261ceb))

## [1.53.0](https://github.com/nicholaschiang/dolce/compare/v1.52.1...v1.53.0) (2023-08-20)


### Features

* **api/designers:** use full text-based search ([ca4e48d](https://github.com/nicholaschiang/dolce/commit/ca4e48d5caf51d92c609c80b6c33d3b2c505543f))

## [1.52.1](https://github.com/nicholaschiang/dolce/compare/v1.52.0...v1.52.1) (2023-08-19)


### Bug Fixes

* **products:** remove rounded borders from images ([112742a](https://github.com/nicholaschiang/dolce/commit/112742adc7ef8706410be15ce8a9a6b13da8d728))
* **routes/show:** do not use show name in `title` ([6cb06f8](https://github.com/nicholaschiang/dolce/commit/6cb06f807f703237bd35d3745bdf8e67234e1818))
* **shows:** avoid FOUC when `totalWidth` is zero ([15bc8cd](https://github.com/nicholaschiang/dolce/commit/15bc8cdee2d5b0710f56667c48d9b6a0a63ba585))
* **shows:** hide `collections` from filter menu ([9f5addc](https://github.com/nicholaschiang/dolce/commit/9f5addc28967319510ed44c75e609c04a911ed93))

## [1.52.0](https://github.com/nicholaschiang/dolce/compare/v1.51.0...v1.52.0) (2023-08-19)


### Features

* add filters bar component to shows page ([163c1b6](https://github.com/nicholaschiang/dolce/commit/163c1b6d23626b7f57da7dcb5cf564582e33f803))
* **filters:** add database level options search ([c583678](https://github.com/nicholaschiang/dolce/commit/c583678f755872e99aeaeafe683580cea0618ef1))
* replace brand shows page with filter link ([24b79ae](https://github.com/nicholaschiang/dolce/commit/24b79aea3df27c628077dcd1426e7ce74440e573))


### Bug Fixes

* **filters:** allow filtering on multiple enums ([f5b1de0](https://github.com/nicholaschiang/dolce/commit/f5b1de06ce2935ceb12c02b8bd88dc0a3c59bc10))
* **filters:** show season name and year in items ([580aa38](https://github.com/nicholaschiang/dolce/commit/580aa38d3373f88d9269f59d7ff40411db797261))
* **filters:** support filtering on any enum ([3568686](https://github.com/nicholaschiang/dolce/commit/35686866906303ac258fd9205bade372968e9ce7))
* hide articles and reviews from show filters ([078912d](https://github.com/nicholaschiang/dolce/commit/078912d91a560109310c03075d4df03c88525ff7))
* **shows:** do not reset filters on infinite scroll ([67dcdd9](https://github.com/nicholaschiang/dolce/commit/67dcdd9d899675332f4585af882c5b7dc6945d5e))
* **shows:** remove redundant results count header ([9593a83](https://github.com/nicholaschiang/dolce/commit/9593a830bb11f9da0f1a2f4c6cf0677278ce9a6b))
* **shows:** restore `/shows` breadcrumb item ([5c9da90](https://github.com/nicholaschiang/dolce/commit/5c9da908a74831517298f6823780e4ecdaa2e8c6))
* **shows:** show "no results" instead of error ([37ca52b](https://github.com/nicholaschiang/dolce/commit/37ca52b253eb0976c9c734413d83f1dc88ef3009))


### Performance Improvements

* **components/header:** prefetch breadcrumb links ([f5c9410](https://github.com/nicholaschiang/dolce/commit/f5c94101780687b3ecb1f6e3df082a721bfa0f0b))

## [1.51.0](https://github.com/nicholaschiang/dolce/compare/v1.50.0...v1.51.0) (2023-08-19)


### Features

* **routes/show:** add designer select for curators ([f730f12](https://github.com/nicholaschiang/dolce/commit/f730f12b110a4e47b4be35ce8c932991fea5f887))
* **show/designers:** show designer articles ([89fc011](https://github.com/nicholaschiang/dolce/commit/89fc011a65dcfae93d5708aa1a5f76fb67053f6b))


### Bug Fixes

* **carousel:** render items as React components ([d604ab3](https://github.com/nicholaschiang/dolce/commit/d604ab3835fa3f720c094dbc50d6a877628df378))

## [1.50.0](https://github.com/nicholaschiang/dolce/compare/v1.49.1...v1.50.0) (2023-08-15)


### Features

* add shows page specific to a single brand ([88f22d5](https://github.com/nicholaschiang/dolce/commit/88f22d5cc5c6e3f5abf6beb844489eddba6c01db))

## [1.49.1](https://github.com/nicholaschiang/dolce/compare/v1.49.0...v1.49.1) (2023-08-14)


### Bug Fixes

* only show filter options that have products ([b8480f3](https://github.com/nicholaschiang/dolce/commit/b8480f3db71c922bcd321e531eb47ebb8ea9ef41))

## [1.49.0](https://github.com/nicholaschiang/dolce/compare/v1.48.0...v1.49.0) (2023-08-14)


### Features

* **routes/sets:** link directly to set page ([c6e6fd7](https://github.com/nicholaschiang/dolce/commit/c6e6fd7bfc5097b5c55519cf9f4c1904a52b5bbe))

## [1.48.0](https://github.com/nicholaschiang/dolce/compare/v1.47.1...v1.48.0) (2023-08-14)


### Features

* create new separate `Article` data model ([e80526f](https://github.com/nicholaschiang/dolce/commit/e80526f936167a4c8c79908b44bf5d7bffb06931))
* **scripts/node:** save designer profiles to db ([cb56e4a](https://github.com/nicholaschiang/dolce/commit/cb56e4a1adcee3a2c25ea11dfa7956df9f776f38))
* **scripts:** scrape designers from Wikipedia ([6e90d99](https://github.com/nicholaschiang/dolce/commit/6e90d9937cccc6041b67e5a91b78f221c765b067))


### Bug Fixes

* **prisma:** do not require article `writtenAt` ([ac92d4c](https://github.com/nicholaschiang/dolce/commit/ac92d4ccdcc4babb69b5af7870b6b5340a511a8f))
* **prisma:** remove unused country `code` column ([6e5bf95](https://github.com/nicholaschiang/dolce/commit/6e5bf957fd3694d736a5216a880a0d5c3616545d))
* **scripts/node:** update to conform with new schema ([23ff38e](https://github.com/nicholaschiang/dolce/commit/23ff38e17eec3c59ddf9490116de9fdacbdfc698))

## [1.47.1](https://github.com/nicholaschiang/dolce/compare/v1.47.0...v1.47.1) (2023-08-12)


### Performance Improvements

* **deps:** upgrade to `prisma` v5.1.1 ([e02d8dd](https://github.com/nicholaschiang/dolce/commit/e02d8dd1ed822114919537d84428e8dccfe9d9df))

## [1.47.0](https://github.com/nicholaschiang/dolce/compare/v1.46.0...v1.47.0) (2023-08-12)


### Features

* **index:** add meta title and capitalization ([ecc12c0](https://github.com/nicholaschiang/dolce/commit/ecc12c0df3fcb8fa7711e2e538a676b887820c2a))

## [1.46.0](https://github.com/nicholaschiang/dolce/compare/v1.45.0...v1.46.0) (2023-08-12)


### Features

* **shows:** add look carousels to shows list ([b70c838](https://github.com/nicholaschiang/dolce/commit/b70c838509928eb4aeeb2e201ddbf874a8b460dc))


### Bug Fixes

* **components/carousel:** use `ol` instead of `ul` ([0175fcb](https://github.com/nicholaschiang/dolce/commit/0175fcbd5a9cd0416830c24e0b1944f0f7268669))
* put automatic revalidation behind an env flag ([f3193b9](https://github.com/nicholaschiang/dolce/commit/f3193b9569143d81797d2092a42ec17183b43205))


### Performance Improvements

* **shows:** reduce default take from 200 to 100 ([d8e2bc2](https://github.com/nicholaschiang/dolce/commit/d8e2bc2e26d073fe57f484352427eee40b260c22))

## [1.45.0](https://github.com/nicholaschiang/dolce/compare/v1.44.1...v1.45.0) (2023-08-12)


### Features

* **map:** add pagination dots to location popover ([f67c52a](https://github.com/nicholaschiang/dolce/commit/f67c52a86adc08571641206bf5345b24f7cb6dc6))
* **map:** show brand count instead of show count ([54c297e](https://github.com/nicholaschiang/dolce/commit/54c297e486a08cd1a53e9a1889425f8ce248ebb2))


### Bug Fixes

* **button:** keep transparent color in dark mode ([f2b4002](https://github.com/nicholaschiang/dolce/commit/f2b4002d4056f47942277f79cc24dcaf7fe4001d))
* **map:** hide scrollbar in location shows carousel ([1d9f889](https://github.com/nicholaschiang/dolce/commit/1d9f88934cffe023757ea2553e20a915448446f2))
* **map:** manually reposition to avoid conflicts ([89956bf](https://github.com/nicholaschiang/dolce/commit/89956bf79604c4918946e4d4779a9ef7f3febb00))
* **map:** restore carousel scroll position on open ([5f26e84](https://github.com/nicholaschiang/dolce/commit/5f26e84c56390229ceee11295a48a90e621a7729))
* **map:** use `cursor-pointer` on location markers ([cf38d6b](https://github.com/nicholaschiang/dolce/commit/cf38d6b66b13b1380bb407aeaa23a50fb7c19b66))

## [1.44.1](https://github.com/nicholaschiang/dolce/compare/v1.44.0...v1.44.1) (2023-08-11)


### Bug Fixes

* **map:** increase color contrast when active ([dd05854](https://github.com/nicholaschiang/dolce/commit/dd05854c777961b170e9ae7d4173352c01f666b1))
* **routes/show:** log entire show contents as `debug` ([0ff3b8b](https://github.com/nicholaschiang/dolce/commit/0ff3b8b968886898d58c3303e24b832ec39638c2))
* **routes/show:** upload video files client-side ([eb5842c](https://github.com/nicholaschiang/dolce/commit/eb5842ccf2b42f0ba112b189e08b0748ce53cc02))
* **routes/show:** use `teal` borders to match map ([27e699c](https://github.com/nicholaschiang/dolce/commit/27e699c37a7b03c94b0d90c3c2a0e04feb1feab6))
* **username/sets:** do not 404 if there are no sets ([5bb9cf8](https://github.com/nicholaschiang/dolce/commit/5bb9cf860579bbf12bc06d1fe7a2f2d1e14a2cad))

## [1.44.0](https://github.com/nicholaschiang/dolce/compare/v1.43.3...v1.44.0) (2023-08-11)


### Features

* **prisma:** add boolean `curator` flag to users ([0b8e941](https://github.com/nicholaschiang/dolce/commit/0b8e941d70f2a1ff70280bb370d29bb11ff69dc6))
* **routes/show:** add "upload video" for curators ([2e9eb00](https://github.com/nicholaschiang/dolce/commit/2e9eb00e7d3fbc5e4fcc15055f8de79c2471aef3))

## [1.43.3](https://github.com/nicholaschiang/dolce/compare/v1.43.2...v1.43.3) (2023-08-11)


### Bug Fixes

* `useLayoutEffect` for DOM measurements ([1a57cb9](https://github.com/nicholaschiang/dolce/commit/1a57cb9a069d5aa86a06cfad93506cf6915d0bb2))
* **app/root:** do not call `FullStory` before init ([08295ca](https://github.com/nicholaschiang/dolce/commit/08295ca5a88574106b461cc32a9603e0a0b89816))
* **profile:** use `PATCH` for updating profile ([de017f4](https://github.com/nicholaschiang/dolce/commit/de017f48917d988cbc4e2431685b26159d5e5bd5))
* **routes/show:** avoid FOUC by rendering client-side ([5491200](https://github.com/nicholaschiang/dolce/commit/5491200a5bd53a56e515dabbdb6172bfd26236b0))
* **routes/show:** call `handleResize` once on mount ([163f022](https://github.com/nicholaschiang/dolce/commit/163f022357b66c52a8000c6cc411022ff8d34ed4))
* **routes:** include location and level in show URL ([0556acb](https://github.com/nicholaschiang/dolce/commit/0556acbf6e80a501c8a93836f3f1c1ec67705299))
* **show/rate-and-review:** replace `action` with `useFetcher` ([c80dd15](https://github.com/nicholaschiang/dolce/commit/c80dd15fe004977592aabff6583fe3675589f7fc))

## [1.43.2](https://github.com/nicholaschiang/dolce/compare/v1.43.1...v1.43.2) (2023-08-11)


### Bug Fixes

* **routes/index:** only render map client-side ([5689b73](https://github.com/nicholaschiang/dolce/commit/5689b73cd27e18054085a09c23b7e00833e6a945))

## [1.43.1](https://github.com/nicholaschiang/dolce/compare/v1.43.0...v1.43.1) (2023-08-11)


### Bug Fixes

* **components/header:** add css responsive design ([3e5f054](https://github.com/nicholaschiang/dolce/commit/3e5f054e07b0522967dfa688376019265ec1e73f))
* **routes/show:** add basic css responsive design ([0d54533](https://github.com/nicholaschiang/dolce/commit/0d5453393ef6696a22f2b227c0248f4b366551f3))

## [1.43.0](https://github.com/nicholaschiang/dolce/compare/v1.42.1...v1.43.0) (2023-08-11)


### Features

* **routes/shows:** add mobile-first UI responsiveness ([25fc963](https://github.com/nicholaschiang/dolce/commit/25fc9639553c177d5eeb07f2eda32f457acccab5))

## [1.42.1](https://github.com/nicholaschiang/dolce/compare/v1.42.0...v1.42.1) (2023-08-10)


### Bug Fixes

* remove special characters from brand slugs ([1d7db07](https://github.com/nicholaschiang/dolce/commit/1d7db071585007492dbcffd7f1f63315ae05762e))
* **show/looks:** do not try to show missing images ([de0d89d](https://github.com/nicholaschiang/dolce/commit/de0d89dd3c6fd3c54468ccee750912cbb62d564e))

## [1.42.0](https://github.com/nicholaschiang/dolce/compare/v1.41.0...v1.42.0) (2023-08-10)


### Features

* **routes/shows:** show results load time ([37238cd](https://github.com/nicholaschiang/dolce/commit/37238cdb2b0a0e371748d5fd5f6e91ec771d2ca8))


### Bug Fixes

* **routes/index:** size map correctly in safari ([236a05d](https://github.com/nicholaschiang/dolce/commit/236a05d540315e24f8f40d00df2fa801d0435405))
* **routes/show:** allow scrolling on padding areas ([e89cbb6](https://github.com/nicholaschiang/dolce/commit/e89cbb6ed3233b5f8a5a1fa2397d36dbcca9b36f))
* **routes/show:** ensure content is centered ([1686312](https://github.com/nicholaschiang/dolce/commit/1686312acc0da6387a11226377dff498cf373d6b))

## [1.41.0](https://github.com/nicholaschiang/dolce/compare/v1.40.1...v1.41.0) (2023-08-10)


### Features

* **root:** add full story session recording ([6700f13](https://github.com/nicholaschiang/dolce/commit/6700f133603c75a2cbd18a4b015d6da8cef38a7c))

## [1.40.1](https://github.com/nicholaschiang/dolce/compare/v1.40.0...v1.40.1) (2023-08-10)


### Bug Fixes

* **deps:** replace `[@vercel](https://github.com/vercel)` with `[@remix-run](https://github.com/remix-run)` ([07675e2](https://github.com/nicholaschiang/dolce/commit/07675e2b92783f4774e126252c7d44e150d6336a))

## [1.40.0](https://github.com/nicholaschiang/dolce/compare/v1.39.0...v1.40.0) (2023-08-10)


### Features

* **components/ui/button:** add `transparent` variant ([930066d](https://github.com/nicholaschiang/dolce/commit/930066de952a6254ec194481f53eb314f1a73937))
* **index:** add basic map of fashion show locations ([5903765](https://github.com/nicholaschiang/dolce/commit/59037657b46bc0bcee08f0daabc30d8496a6cf97))
* **routes/index:** add homepage header tag line ([35a39b5](https://github.com/nicholaschiang/dolce/commit/35a39b50f3467ea10915eb8bc1b040ee6ea122ca))
* **routes/index:** add location popovers to map ([2226302](https://github.com/nicholaschiang/dolce/commit/2226302ba1ff0668ce994eef6c95606e7c5a5f8e))
* **routes/shows:** add the shows count to header ([d0e20d0](https://github.com/nicholaschiang/dolce/commit/d0e20d0f95d047ade837bd51e0bfaf230cbc5c18))


### Bug Fixes

* **components/ui/popover:** export `<PopoverClose>` ([7026d7d](https://github.com/nicholaschiang/dolce/commit/7026d7d792cfe43102ff1c254b3dde24f3020143))
* **routes/index:** address some eslint errors ([a23d2cb](https://github.com/nicholaschiang/dolce/commit/a23d2cb3d4d1f2c3bb4a7d0513ffb6dba27d518a))
* **routes/index:** do not center map to viewport ([45392d4](https://github.com/nicholaschiang/dolce/commit/45392d4a922a3d178a67c0e7cc367fb0cf6687c0))
* **routes/index:** remove map projection skew ([a24b7ed](https://github.com/nicholaschiang/dolce/commit/a24b7ed42a7a5aea4a73712d9350942d9b0b25aa))
* **show/show-info:** show user friendly location name ([b8bec3c](https://github.com/nicholaschiang/dolce/commit/b8bec3c91e4c20df77e3a5d7328e399a81c879f1))

## [1.39.0](https://github.com/nicholaschiang/dolce/compare/v1.38.0...v1.39.0) (2023-08-09)


### Features

* **routes/index:** update hero image to lake como ([c11e37e](https://github.com/nicholaschiang/dolce/commit/c11e37e4654ec8714d354f7de88c048122026f88))


### Bug Fixes

* **products:** reduce filters navigation bar height ([21915ec](https://github.com/nicholaschiang/dolce/commit/21915ec9ee97fa71c99726c0638ddfda5c36a1e2))

## [1.38.0](https://github.com/nicholaschiang/dolce/compare/v1.37.0...v1.38.0) (2023-08-09)


### Features

* **routes/username:** add user profiles to sitemap ([f8cbd01](https://github.com/nicholaschiang/dolce/commit/f8cbd01fb0d0139b6c8dcaf115d83cb2711b8a93))
* **routes/username:** add username to meta title ([ff64fd3](https://github.com/nicholaschiang/dolce/commit/ff64fd3631f3ce684b66370aacd1ef3400822a21))


### Bug Fixes

* **routes/profile:** disable button when submitting ([bbbd829](https://github.com/nicholaschiang/dolce/commit/bbbd829afbfd1cd5e0471d293efa3e89e8c102fa))

## [1.37.0](https://github.com/nicholaschiang/dolce/compare/v1.36.0...v1.37.0) (2023-08-08)


### Features

* **routes/username:** add set folders to profile ([8bf647e](https://github.com/nicholaschiang/dolce/commit/8bf647e02e880f629ead0e19e3044a4007a3b193))
* **routes/username:** clicking stats opens tab ([5357eba](https://github.com/nicholaschiang/dolce/commit/5357ebaf835fc7ffc671c121b72cc8747e9d8c9c))


### Bug Fixes

* **app.css:** reduce `nprogress` height to `1.5px` ([98c37d3](https://github.com/nicholaschiang/dolce/commit/98c37d3c855d3837929495967b4fcecd1edae33f))

## [1.36.0](https://github.com/nicholaschiang/dolce/compare/v1.35.3...v1.36.0) (2023-08-08)


### Features

* automatically revalidate on focus or reconnect ([0cf4304](https://github.com/nicholaschiang/dolce/commit/0cf43042ad0becc60fb0979a99ae1723afaf71c1))

## [1.35.3](https://github.com/nicholaschiang/dolce/compare/v1.35.2...v1.35.3) (2023-08-08)


### Bug Fixes

* **routes:** use `redirectTo` when already logged in ([f978909](https://github.com/nicholaschiang/dolce/commit/f97890910857a0694692bba2ae65a3695ab33b60))
* **show/looks:** do not close set select on create ([b8219b8](https://github.com/nicholaschiang/dolce/commit/b8219b8f6f5ec84f281fcb7490ced173ad72dc22))

## [1.35.2](https://github.com/nicholaschiang/dolce/compare/v1.35.1...v1.35.2) (2023-08-08)


### Bug Fixes

* **components/header:** hide login button on join page ([356bfd4](https://github.com/nicholaschiang/dolce/commit/356bfd412ab5fca6c257c720bba81e792a9dfac9))
* **shows:** reduce brand name line height ([fb6df72](https://github.com/nicholaschiang/dolce/commit/fb6df72ae839d483e882d1409e0b5a191bd57964))
* **utils:** don't check user type in `useUser` ([9bcef8d](https://github.com/nicholaschiang/dolce/commit/9bcef8d1a2b93192d73ebd09741227eef8c83852))

## [1.35.1](https://github.com/nicholaschiang/dolce/compare/v1.35.0...v1.35.1) (2023-08-08)


### Bug Fixes

* **app.css:** update `frosted` utility for dark theme ([941ef8b](https://github.com/nicholaschiang/dolce/commit/941ef8bf6d235dd2bffdd3dfdb9d47bc3f1276a1))
* replace `border-gray-700` with `border-gray-800` ([91a3f20](https://github.com/nicholaschiang/dolce/commit/91a3f202df5c52cb68a479a14e1bea5a9fc12a6e))

## [1.35.0](https://github.com/nicholaschiang/dolce/compare/v1.34.0...v1.35.0) (2023-08-08)


### Features

* add `<LoadingLine>` to header when navigating ([99b7bad](https://github.com/nicholaschiang/dolce/commit/99b7bad33dd3210bf6eeef3dbf6bddf38109f67c))


### Bug Fixes

* **app/app.css:** reduce `nprogress` contrast ([7db1b61](https://github.com/nicholaschiang/dolce/commit/7db1b6128c4d8d390e0b062866d4d79e47fa1bf8))
* redirect to current page on login or logout ([a7f60ef](https://github.com/nicholaschiang/dolce/commit/a7f60ef460429bbf3653cbaf88c9ec1bea114c10))
* **save:** don't duplicate preload request ([a714a0b](https://github.com/nicholaschiang/dolce/commit/a714a0bf6312bb5edf012d1d47574c48db9fcc20))
* **save:** redirect unauthenticated users to login ([df6af63](https://github.com/nicholaschiang/dolce/commit/df6af63e6c45fdcd24d914699fd8907da3c473d7))
* **show/rate-and-review:** disable button on submit only ([37ce177](https://github.com/nicholaschiang/dolce/commit/37ce177d67e9d04decb0e42c030e89c240e19cb3))

## [1.34.0](https://github.com/nicholaschiang/dolce/compare/v1.33.0...v1.34.0) (2023-08-08)


### Features

* add "sets" multi-select when saving a look ([d240238](https://github.com/nicholaschiang/dolce/commit/d2402381861ffa81e9e907eed8eec84857063bdd))
* **components/ui/command:** add subtle loader ([c8e105c](https://github.com/nicholaschiang/dolce/commit/c8e105c1bc9db961320b42dac19228d0090bc075)), closes [/github.com/pacocoursey/cmdk/blob/main/website/styles/cmdk/raycast.scss#L348](https://github.com/nicholaschiang//github.com/pacocoursey/cmdk/blob/main/website/styles/cmdk/raycast.scss/issues/L348) [/github.com/pacocoursey/cmdk/blob/main/website/styles/cmdk/raycast.scss#L105](https://github.com/nicholaschiang//github.com/pacocoursey/cmdk/blob/main/website/styles/cmdk/raycast.scss/issues/L105)
* **routes/sets:** add new "sets" index list page ([c7dde11](https://github.com/nicholaschiang/dolce/commit/c7dde11f4645fef855a674a023cbab7a4e62cfc6))
* **show/looks:** add "create new set" option ([bf19ec4](https://github.com/nicholaschiang/dolce/commit/bf19ec4a9bd95b3f3a416fcf13668d74bbe1bd29))
* **utils:** add `uniq` function for filtering arrays ([8d4cb58](https://github.com/nicholaschiang/dolce/commit/8d4cb58ec861373b7f5600d5a21538e0850c1588))


### Bug Fixes

* **components/ui/button:** show background when active ([40d361c](https://github.com/nicholaschiang/dolce/commit/40d361c200172676c0d80f2e15ffa5b95ee37cf6))
* **routes/show:** always load the latest look image ([078d51a](https://github.com/nicholaschiang/dolce/commit/078d51a54ad830ceee84b2802519fa47327c41b8))
* **show/looks:** add `max-height` to sets select ([dd73f0c](https://github.com/nicholaschiang/dolce/commit/dd73f0cd436ae8c8e0152f9575db0eded015741f))


### Performance Improvements

* **show/looks:** preload sets on save button hover ([d09c281](https://github.com/nicholaschiang/dolce/commit/d09c281c33d66b26f07dbb09f7286e3e8bc04de1))

## [1.33.0](https://github.com/nicholaschiang/dolce/compare/v1.32.0...v1.33.0) (2023-08-08)


### Features

* users can upload avatar images from profile ([fe1ab82](https://github.com/nicholaschiang/dolce/commit/fe1ab82947e865c82d2f9e3bbe6f609354276800))


### Bug Fixes

* **components/theme-switcher:** hotkey toggles cookie ([d44c674](https://github.com/nicholaschiang/dolce/commit/d44c674911a6d57a125f66b9f7a6aa77239665b6))
* **components/ui/avatar:** add `object-cover` ([7575ba5](https://github.com/nicholaschiang/dolce/commit/7575ba5e69c11fd7e3f45dbb3ff89a4c89698356))

## [1.32.0](https://github.com/nicholaschiang/dolce/compare/v1.31.0...v1.32.0) (2023-08-07)


### Features

* **components/consumer-review:** link to user page ([1a84b0c](https://github.com/nicholaschiang/dolce/commit/1a84b0c7ce53f68cc1aae418d5b4e8849ed0599e))
* **prisma:** users can save looks to a `Set` ([f7a8307](https://github.com/nicholaschiang/dolce/commit/f7a8307452da94c3a2895b43558031ca05cfcd45))
* **profile:** add user description text area field ([4be88be](https://github.com/nicholaschiang/dolce/commit/4be88bea9f48f9149b459fb5eae3307172846ec1))
* **routes/show:** add convenience redirect route ([c203cfe](https://github.com/nicholaschiang/dolce/commit/c203cfe883621fd8b4d0cd67f5cf031f4e1e574f))
* **routes/user:** add public user profile page ([79da409](https://github.com/nicholaschiang/dolce/commit/79da409fd75497214f4dd600a228aaac6d12ad03))
* **show/looks:** add "save" icon button toggle ([4705207](https://github.com/nicholaschiang/dolce/commit/4705207e62dfdbe00110ebf720fdb08c190f48d5))


### Bug Fixes

* **app/app.css:** make scroll bars more apparent ([6311272](https://github.com/nicholaschiang/dolce/commit/6311272a12209930d3a6f6dc7de410aa7630f055))
* **components/ui/button:** shrink icon button size ([056f5cd](https://github.com/nicholaschiang/dolce/commit/056f5cdbdee47503ed0538770e4006797c9b7803))
* **shows:** ensure `neededSkip` is not negative ([7525980](https://github.com/nicholaschiang/dolce/commit/75259805f4967c537c3a8df22c685266c00c4ea2))

## [1.31.0](https://github.com/nicholaschiang/site/compare/v1.30.3...v1.31.0) (2023-08-07)


### Features

* add golden kissing laurels favicon ([5452fff](https://github.com/nicholaschiang/site/commit/5452fff55d3b6f83c83241225ad2f334e116ff3a))
* **app:** replace "Nicholas Chiang" with "DOLCE" ([c227321](https://github.com/nicholaschiang/site/commit/c227321cb398a7de7d57fcb36c80523ad4c944c6))
* **index:** add custom header to index page ([5996d84](https://github.com/nicholaschiang/site/commit/5996d84d854ccf4c446cb94c153d53b34b63e189))
* **index:** replace timeline with "dolce" definition ([601cc5a](https://github.com/nicholaschiang/site/commit/601cc5acaf0420f1b375703a68a6647a3accf36e))
* **root:** update header to read "dolce" ([4202649](https://github.com/nicholaschiang/site/commit/4202649f4e4b39b2732eff4697a80f0518c86291))


### Bug Fixes

* **root:** remove link to private repository ([54abb85](https://github.com/nicholaschiang/site/commit/54abb8545ce7fa675f7599337aac35ac35f9d01f))
* **shows:** update header styling to match nav ([fc0dd36](https://github.com/nicholaschiang/site/commit/fc0dd36d2a7305d8daba0c5b5c63b1375c6eda1b))
* **utils:** update `BASE_URL` to `dolce.so` ([0d778bd](https://github.com/nicholaschiang/site/commit/0d778bdd5b5fc275cf3c97c4e085705a80fa89bd))

## [1.30.3](https://github.com/nicholaschiang/site/compare/v1.30.2...v1.30.3) (2023-08-06)


### Bug Fixes

* **show:** do not try to load missing look images ([cc5a406](https://github.com/nicholaschiang/site/commit/cc5a40673ad304f5e99de0cfa3d265dbe9f5b410))

## [1.30.2](https://github.com/nicholaschiang/site/compare/v1.30.1...v1.30.2) (2023-08-06)


### Bug Fixes

* **scripts/wwd:** do not include location in name ([b847754](https://github.com/nicholaschiang/site/commit/b847754b9cc91d111d219bd0412af5988552d1ed))

## [1.30.1](https://github.com/nicholaschiang/site/compare/v1.30.0...v1.30.1) (2023-08-03)


### Bug Fixes

* **root:** hide `nprogress` for page replacements ([f2cab2d](https://github.com/nicholaschiang/site/commit/f2cab2d8736b126e8950922e5bfc3b50632010b5))


### Performance Improvements

* **shows:** virtualize and add infinite scrolling ([223cea4](https://github.com/nicholaschiang/site/commit/223cea4add69a9b745b2a10b5914cd1cd5666d4f))

## [1.30.0](https://github.com/nicholaschiang/site/compare/v1.29.0...v1.30.0) (2023-08-02)


### Features

* **scripts/wwd:** add import script and migrations ([5d3e9b5](https://github.com/nicholaschiang/site/commit/5d3e9b59b8edc4a4f4b3c801a6496c5fe1faf0e9))
* **spiders/wwd:** add scrapy script for wwd shows ([2ae542c](https://github.com/nicholaschiang/site/commit/2ae542c2846aa6c4c98c6cf34563dab9e96ed71d))


### Bug Fixes

* combine duplicate show looks and images ([cd23a98](https://github.com/nicholaschiang/site/commit/cd23a98581e9d353af5e4373c7457184f6085423))
* **utils/show:** include show level in subtitle ([da2a89c](https://github.com/nicholaschiang/site/commit/da2a89c2df906533d248c83fc1cd39378eef2f4d))

## [1.29.0](https://github.com/nicholaschiang/site/compare/v1.28.1...v1.29.0) (2023-07-30)


### Features

* **prisma:** replace show location string with enum ([769f085](https://github.com/nicholaschiang/site/commit/769f085000fb5bd1e7b26f3ead8fcbc7aba46a32))
* **scripts/vogue:** import all vogue show data ([3ec6fce](https://github.com/nicholaschiang/site/commit/3ec6fce2be5f33ca1d87ebcb2623f78bd69b728e))
* update database enums to match vogue ([862769a](https://github.com/nicholaschiang/site/commit/862769a7dbd17d102a2a50be5e32abebee331f05))


### Bug Fixes

* **prisma:** add `location` to show unique constraint ([dc6c058](https://github.com/nicholaschiang/site/commit/dc6c058eefd3f89e5dbbb3714608217ea718f049))
* **prisma:** address typo in shanghai enum value ([fd9f2b3](https://github.com/nicholaschiang/site/commit/fd9f2b35d3a85708af63e4185c57516f76066adb))
* **public/data/vogue:** move shows to `static` ([366549c](https://github.com/nicholaschiang/site/commit/366549c5344792264f3db1fa48f56a5d4fa2c8eb))
* **scripts/vogue:** filter out duplicate shows ([1f7a9df](https://github.com/nicholaschiang/site/commit/1f7a9df1fdc041c40f14dfcf1f0a886a5d2bd5f3))

## [1.28.1](https://github.com/nicholaschiang/site/compare/v1.28.0...v1.28.1) (2023-07-30)


### Bug Fixes

* **shows:** sort by brand name and then by year ([e3addd1](https://github.com/nicholaschiang/site/commit/e3addd109a05db11e87e7639afab9ab8faa2cf8b))


### Performance Improvements

* **app:** disable image optimization for now ([9f3ef87](https://github.com/nicholaschiang/site/commit/9f3ef8789ee4378d8208e2d268350364e8e56f1f))

## [1.28.0](https://github.com/nicholaschiang/site/compare/v1.27.0...v1.28.0) (2023-07-29)


### Features

* add sitemap and all show routes to map ([c881173](https://github.com/nicholaschiang/site/commit/c88117373819fdd08894b1980b37123b9eeea10d))

## [1.27.0](https://github.com/nicholaschiang/site/compare/v1.26.0...v1.27.0) (2023-07-29)


### Features

* **routes/show:** add `Event` structured data ([5db4b4f](https://github.com/nicholaschiang/site/commit/5db4b4f8390286e6734b090f5e7ac3e8cd3cb0c2))

## [1.26.0](https://github.com/nicholaschiang/site/compare/v1.25.1...v1.26.0) (2023-07-28)


### Features

* **prisma/seed:** create fashion show after reset ([9e0271d](https://github.com/nicholaschiang/site/commit/9e0271d8727dd1551fa100fd8bd92bbeebb0af17))


### Bug Fixes

* **app:** add `aria-label` to icon button links ([e5c06f3](https://github.com/nicholaschiang/site/commit/e5c06f3539d90130fff715ae16762e8a3fba1792))
* **env.example:** do not use cache during tests ([eb09e0c](https://github.com/nicholaschiang/site/commit/eb09e0ce94ae6a5ee7c4e598a49198052cadf71d)), closes [/github.com/prisma/prisma/issues/7678#issuecomment-864967237](https://github.com/nicholaschiang//github.com/prisma/prisma/issues/7678/issues/issuecomment-864967237)
* **routes:** replace "login" with "log in" ([59baaa9](https://github.com/nicholaschiang/site/commit/59baaa990c0b64ddf7c5068acc79583d747be620))
* **scripts/node/save/shows:** use `gh` media links ([4ca9498](https://github.com/nicholaschiang/site/commit/4ca9498dd5becd7b69c7a0f4930c60b7337120ca))
* **show/rate-and-review:** set `aria-labelledby` ([ecea55d](https://github.com/nicholaschiang/site/commit/ecea55d2b1fa4226c8686336f94abc56629f7dd2))

## [1.25.1](https://github.com/nicholaschiang/site/compare/v1.25.0...v1.25.1) (2023-07-28)


### Bug Fixes

* **routes/show:** submit reviews to correct path ([a5a66c2](https://github.com/nicholaschiang/site/commit/a5a66c2ee5d478018106deccfeef6b8262d3ed73))

## [1.25.0](https://github.com/nicholaschiang/site/compare/v1.24.1...v1.25.0) (2023-07-28)


### Features

* add unique brand slugs and show sex cols ([0c561df](https://github.com/nicholaschiang/site/commit/0c561df03095b956dd9f5aa150b5718a1716c621))
* **routes:** add user friendly show paths ([fbbef08](https://github.com/nicholaschiang/site/commit/fbbef0873cf9d3f2c83428e5e3b43e80f2f69b95))

## [1.24.1](https://github.com/nicholaschiang/site/compare/v1.24.0...v1.24.1) (2023-07-28)


### Performance Improvements

* **routes:** add intent-based link prefetching ([4ae6ee8](https://github.com/nicholaschiang/site/commit/4ae6ee899704ca83b16c3c24ddf69480cb04985d))
* **routes:** lazy load show and look images ([296cc9e](https://github.com/nicholaschiang/site/commit/296cc9ed7db56414dc5589aba116e9bf09962947))

## [1.24.0](https://github.com/nicholaschiang/site/compare/v1.23.1...v1.24.0) (2023-07-27)


### Features

* **root:** add author, copyright, and referrer meta ([ebfbc2f](https://github.com/nicholaschiang/site/commit/ebfbc2f59a08db54192e0c4846f4ec23f972a135))
* **routes:** add meta descriptions to show pages ([4680561](https://github.com/nicholaschiang/site/commit/468056153efe88829ba7c412ca315a8f3a25c4e7))

## [1.23.1](https://github.com/nicholaschiang/site/compare/v1.23.0...v1.23.1) (2023-07-26)


### Bug Fixes

* **utils/schema:** allow single word names ([3e004f4](https://github.com/nicholaschiang/site/commit/3e004f428dc7636b410816cb608f26858b144eda))

## [1.23.0](https://github.com/nicholaschiang/site/compare/v1.22.1...v1.23.0) (2023-07-26)


### Features

* **login:** authenticate with email or username ([421f888](https://github.com/nicholaschiang/site/commit/421f888c273ad8239e0217fd0b0b779535674ab5))

## [1.22.1](https://github.com/nicholaschiang/site/compare/v1.22.0...v1.22.1) (2023-07-26)


### Bug Fixes

* replace `@radix-ui/react-icons` with `lucide-react` ([045cb35](https://github.com/nicholaschiang/site/commit/045cb35e7cb8cc38a694378d7abb706307d6b8db))

## [1.22.0](https://github.com/nicholaschiang/site/compare/v1.21.0...v1.22.0) (2023-07-25)


### Features

* **routes:** add profile settings page ([2caa531](https://github.com/nicholaschiang/site/commit/2caa53186e431a95f32c0a921b1c778eb9eb3acb))


### Bug Fixes

* **components/list-layout:** avoid `<main>` nesting ([ee04f6a](https://github.com/nicholaschiang/site/commit/ee04f6a49942b232db381af75f768ddf46dcd106))
* replace `@remix-run/server-runtime` with `@vercel/remix` ([fcb385b](https://github.com/nicholaschiang/site/commit/fcb385b5495c728e14d8cdee8a3430b2debb65e4))

## [1.21.0](https://github.com/nicholaschiang/site/compare/v1.20.2...v1.21.0) (2023-07-25)


### Features

* **show/scores-header:** keep show video on loop ([f973a2e](https://github.com/nicholaschiang/site/commit/f973a2e3f002d78e47582c5b7c6856cc82f704e3))

## [1.20.2](https://github.com/nicholaschiang/site/compare/v1.20.1...v1.20.2) (2023-07-25)


### Bug Fixes

* **routes/show:** hide empty "about" sections ([738a8ef](https://github.com/nicholaschiang/site/commit/738a8ef918740198bcdd597f756511286df1d8c1))

## [1.20.1](https://github.com/nicholaschiang/site/compare/v1.20.0...v1.20.1) (2023-07-25)


### Bug Fixes

* **scripts/vogue:** omit duplicate "menswear" in show title ([90fdc4d](https://github.com/nicholaschiang/site/commit/90fdc4d75b09db9a9f04cd2326db706b42fe798c))

## [1.20.0](https://github.com/nicholaschiang/site/compare/v1.19.0...v1.20.0) (2023-07-25)


### Features

* add `collection.sex` field ([66e190f](https://github.com/nicholaschiang/site/commit/66e190f2b9559d65f482e02ed1b845aa717f77df))
* **prisma:** add "resort" season name ([13e359f](https://github.com/nicholaschiang/site/commit/13e359f1725016d907ebea6fb847a75eddfd0590))
* **prisma:** add review "written at" date field ([0f4c5e9](https://github.com/nicholaschiang/site/commit/0f4c5e904119785acbea4454acb1613a92793988))
* **scripts:** scrape and save shows from vogue ([986e27d](https://github.com/nicholaschiang/site/commit/986e27d445b05473c774696740901b5b53b1d1e3))


### Bug Fixes

* allow show date to be `NULL` when not known ([e12c12d](https://github.com/nicholaschiang/site/commit/e12c12d3375602691a8742a1526b9828b827bc8d))
* ensure look images fully cover wrappers ([a11ba75](https://github.com/nicholaschiang/site/commit/a11ba75ac2dd27a4dc81b41cfa4a8dffc0cbaa8a))
* make show video and review score optional ([852c587](https://github.com/nicholaschiang/site/commit/852c587d90f03267e0fc76e5435501e637b56287))
* make the show description field optional ([8c59494](https://github.com/nicholaschiang/site/commit/8c594940cf99eb75e875dad69297abfd71d8e6f7))
* **prisma:** mark most brand fields as optional ([4e67bcd](https://github.com/nicholaschiang/site/commit/4e67bcdce46ce2890eba8ad91f82e3008e0b4232))
* **routes/show-info:** render description as HTML ([9ed0077](https://github.com/nicholaschiang/site/commit/9ed0077a40a5cafe8015c8984c410c391ad32fa9))
* set show location to `NULL` if unknown ([a21fdd4](https://github.com/nicholaschiang/site/commit/a21fdd4d71cac2dfaef4425778db74d847b13782))
* **shows:** add "menswear" part of season name ([631a420](https://github.com/nicholaschiang/site/commit/631a4206161a195f8456b341c32f7c8ee4014909))

## [1.19.0](https://github.com/nicholaschiang/site/compare/v1.18.0...v1.19.0) (2023-07-24)


### Features

* **public:** add favicon design assets ([9552c4c](https://github.com/nicholaschiang/site/commit/9552c4ca56fdeb7680b50407cb8cfff893f88443))

## [1.18.0](https://github.com/nicholaschiang/site/compare/v1.17.0...v1.18.0) (2023-07-24)


### Features

* add `nprogress` page transition indicator ([d56dd24](https://github.com/nicholaschiang/site/commit/d56dd24a891a97683612ed731ea586855660117f))
* add emoji favicon generated by `favicon.io` ([46e4676](https://github.com/nicholaschiang/site/commit/46e467618bb0bee892cfb8cb31ba4eebaaed0ec7))
* **routes:** set useful meta title tags ([014eb93](https://github.com/nicholaschiang/site/commit/014eb933bd7e7c4b4028cedf0a336bf1acc3964c))

## [1.17.0](https://github.com/nicholaschiang/site/compare/v1.16.2...v1.17.0) (2023-07-24)


### Features

* add designer section to show page ([ed19e4f](https://github.com/nicholaschiang/site/commit/ed19e4fc7c65df529a18810030a8ef3dbae13243))
* **show/designers:** collapse description by default ([46628d3](https://github.com/nicholaschiang/site/commit/46628d30c16160c89870fa2a0a2a9d0ae83d893b))

## [1.16.2](https://github.com/nicholaschiang/site/compare/v1.16.1...v1.16.2) (2023-07-23)


### Bug Fixes

* users can only submit one review per show ([2fbbd45](https://github.com/nicholaschiang/site/commit/2fbbd455e5a21249bf0dd1e9860968a297a60ab0))

## [1.16.1](https://github.com/nicholaschiang/site/compare/v1.16.0...v1.16.1) (2023-07-23)


### Bug Fixes

* **show/rate-and-review:** go to login on click ([051b6d8](https://github.com/nicholaschiang/site/commit/051b6d837c955a192119ddedf1fadef9a14681b6))

## [1.16.0](https://github.com/nicholaschiang/site/compare/v1.15.0...v1.16.0) (2023-07-23)


### Features

* **components/empty:** increase rounding to `md` ([adcce56](https://github.com/nicholaschiang/site/commit/adcce56531941fe11c13e9eb36ab2b1e9400764d))
* **components/ui:** add `<Textarea>` from `shadcn-ui` ([125debc](https://github.com/nicholaschiang/site/commit/125debc42727e0d238b7c62a29190c62b7850f9e))
* **prisma:** add `createdAt` and `updatedAt` fields ([00dda3f](https://github.com/nicholaschiang/site/commit/00dda3f7f23221154b254e69ebee4c95b442e6c5))
* **routes/show:** add consumer review sections ([a2818b2](https://github.com/nicholaschiang/site/commit/a2818b24cb0924c907450f5c64365f79f45e2afc))
* **routes/show:** add links to section headers ([58c0c23](https://github.com/nicholaschiang/site/commit/58c0c2381e53789945cfe1ab728075baf7f279bc))
* **routes/show:** add star-based score input ([df8fdfb](https://github.com/nicholaschiang/site/commit/df8fdfbf7f919bd286e57ad45c9171bf18697be6))
* **routes/show:** add transition to star input ([e0f82e9](https://github.com/nicholaschiang/site/commit/e0f82e9259b466d734898cb47371bc21a1cf5898))
* use darker tailwind `dark` theme ([25b9ed6](https://github.com/nicholaschiang/site/commit/25b9ed63e3d3b6b631f80e7aa04b23905a433b2b))


### Bug Fixes

* **log.server:** reduce log level to `info` ([80f5d55](https://github.com/nicholaschiang/site/commit/80f5d55ad1b1ca995210bb4a6a8659a7a0fda6fb))
* pass `redirectTo` between login and sign up ([6f7cc79](https://github.com/nicholaschiang/site/commit/6f7cc79febb30b1cf178daae91bd94730cb4262d))
* **prisma:** don't require review titles ([3aef447](https://github.com/nicholaschiang/site/commit/3aef4470f4f82e9e5dcc5e1bc457d1636546ab4a))
* **routes/show:** links to sections show headers ([bd37e47](https://github.com/nicholaschiang/site/commit/bd37e47f92efbce2b232b45ef47a7b498b3a30e5))
* **routes/shows:** remove flowers rating key ([1fd7d8d](https://github.com/nicholaschiang/site/commit/1fd7d8df7a51342c3231bd1545c405b9dbc99360))
* **routes:** mark login and sign up fields required ([557649f](https://github.com/nicholaschiang/site/commit/557649f88d2e12f5f97321540bf67d6211519ce5))
* **routes:** render breadcrumb for 404 pages ([b300f82](https://github.com/nicholaschiang/site/commit/b300f82a8f88e5b32082d264cdb943002d7b4469))
* **show/where-to-buy:** invert logos in dark mode ([cbd35d6](https://github.com/nicholaschiang/site/commit/cbd35d696f9ed53ee6e65b5e3505c895f96cc94d))
* **show:** style consumer reviews like insta comments ([b6348ba](https://github.com/nicholaschiang/site/commit/b6348ba70b4f42f0f66133b8b969048177fc30ea))

## [1.15.0](https://github.com/nicholaschiang/site/compare/v1.14.1...v1.15.0) (2023-07-23)


### Features

* calculate show scores based on review scores ([9029909](https://github.com/nicholaschiang/site/commit/90299099cecdce627a191355efc6a4d2da61c3ec))

## [1.14.1](https://github.com/nicholaschiang/site/compare/v1.14.0...v1.14.1) (2023-07-23)


### Bug Fixes

* **routes/show:** style "where to buy" alt text ([9d94e20](https://github.com/nicholaschiang/site/commit/9d94e20d10653f319566587049c3008ad3a3402e))
* **routes:** use `nodejs` runtime for auth pages ([aff66f3](https://github.com/nicholaschiang/site/commit/aff66f312f92c05c003a40d33ab59a8066afb974))

## [1.14.0](https://github.com/nicholaschiang/site/compare/v1.13.0...v1.14.0) (2023-07-23)


### Features

* **routes/show:** add metadata to "show info" ([20afa79](https://github.com/nicholaschiang/site/commit/20afa79c3d7e7cb8ffc00f492c2a0a8d842e533c))

## [1.13.0](https://github.com/nicholaschiang/site/compare/v1.12.2...v1.13.0) (2023-07-23)


### Features

* add `show.url` and `retailer.company` ([49670b1](https://github.com/nicholaschiang/site/commit/49670b165ff91ea8c181db733986648f75554cef))
* **prisma:** add avatar fields for everything ([0c81bdb](https://github.com/nicholaschiang/site/commit/0c81bdb472b75436e4c2aa073344d2d2367dee83))
* **prisma:** add collection and brand links ([5027445](https://github.com/nicholaschiang/site/commit/5027445173a679eb3e5ebb72068688a4bb4a3f58))
* **prisma:** add website urls to everything ([6a0f02b](https://github.com/nicholaschiang/site/commit/6a0f02b5b14b70769b857afd1b4a8498070a6eff))
* **routes/show:** add "where to buy" section ([a909447](https://github.com/nicholaschiang/site/commit/a909447a4583c9d1e37bd1f09169cbe2fdba5e6f))

## [1.12.2](https://github.com/nicholaschiang/site/compare/v1.12.1...v1.12.2) (2023-07-22)


### Bug Fixes

* **app/utils:** remove unnecessary type assertion ([e37e997](https://github.com/nicholaschiang/site/commit/e37e997f5eba180a132a1b5c211d0c8aad63787b))


### Performance Improvements

* **root:** use edge runtime for all routes ([44a6ad4](https://github.com/nicholaschiang/site/commit/44a6ad4932bc46fca8caa88a0d60272c29ba82ce))

## [1.12.1](https://github.com/nicholaschiang/site/compare/v1.12.0...v1.12.1) (2023-07-22)


### Bug Fixes

* **routes/show:** use explicit `emerald` color name ([3450b6d](https://github.com/nicholaschiang/site/commit/3450b6db55a0bb4f8c8491e2de4e5b28174c1e4d))

## [1.12.0](https://github.com/nicholaschiang/site/compare/v1.11.0...v1.12.0) (2023-07-22)


### Features

* add login form using new components ([e729835](https://github.com/nicholaschiang/site/commit/e72983509e15d803d8be4427217fc3c6c77bcaa5)), closes [/github.com/radix-ui/primitives/pull/1977#issuecomment-1440233271](https://github.com/nicholaschiang//github.com/radix-ui/primitives/pull/1977/issues/issuecomment-1440233271)
* add sign up page and logout functionality ([0418464](https://github.com/nicholaschiang/site/commit/04184646a8dfb9ba3363f86e7158c38ec788e55e))
* **routes/login:** add `/login` breadcrumb ([199f0a2](https://github.com/nicholaschiang/site/commit/199f0a29078fe099b9c1733c11ed5bba39e0668c))
* **routes:** replace "John Doe" with "Anna Wintour" ([d65262e](https://github.com/nicholaschiang/site/commit/d65262e68526e468310b835f6e7d8770d63bb8a8))


### Bug Fixes

* **routes/shows:** remove opaque background from scores ([04b4043](https://github.com/nicholaschiang/site/commit/04b4043da3d8216e7a9e42d4e01049ca189333af))
* **routes/shows:** remove unnecessary `mt-auto` ([39303ec](https://github.com/nicholaschiang/site/commit/39303ec8e650f19486b01495d75d1e4fee643f7d))
* **routes:** update login and join `meta` function ([db4c726](https://github.com/nicholaschiang/site/commit/db4c726e8a28657b9e2d274032cdc227a9cac8c8))
* **routes:** verify there are no existing users ([cf1ee57](https://github.com/nicholaschiang/site/commit/cf1ee5777b66701599c9032b80ad9fcf5e20c1f9))

## [1.11.0](https://github.com/nicholaschiang/site/compare/v1.10.0...v1.11.0) (2023-07-21)


### Features

* **routes/shows:** add rose score key explanation ([014e5e4](https://github.com/nicholaschiang/site/commit/014e5e4aa75bc6abdeeb19cf53f559399d257805))
* **routes/shows:** show percentage ratings ([badcf52](https://github.com/nicholaschiang/site/commit/badcf520525e7f8e37ac3c25bf125d8a68374012))

## [1.10.0](https://github.com/nicholaschiang/site/compare/v1.9.2...v1.10.0) (2023-07-21)


### Features

* **prisma:** add critic review fields ([1b93f00](https://github.com/nicholaschiang/site/commit/1b93f000c41f71d6a39352143b97e965f25e089d))

## [1.9.2](https://github.com/nicholaschiang/site/compare/v1.9.1...v1.9.2) (2023-07-21)


### Bug Fixes

* add necessary routes for product filters ([07e3a62](https://github.com/nicholaschiang/site/commit/07e3a6268c4b45c3f760df47f4df11650b33e34e))


### Performance Improvements

* **routes/show:** apply look sorting in database ([4a9ae15](https://github.com/nicholaschiang/site/commit/4a9ae15298cc0ca480b5c81e812da909d080e089))

## [1.9.1](https://github.com/nicholaschiang/site/compare/v1.9.0...v1.9.1) (2023-07-21)


### Bug Fixes

* **routes/show:** adjust `object-cover` for safari ([79ce8b1](https://github.com/nicholaschiang/site/commit/79ce8b12826d5e5caccb63109b3d0415973cd8e7))

## [1.9.0](https://github.com/nicholaschiang/site/compare/v1.8.0...v1.9.0) (2023-07-21)


### Features

* add breadcrumb header with `useMatches` ([40261c9](https://github.com/nicholaschiang/site/commit/40261c93860ec27f24d5b3cd2d96c0e07681700f))

## [1.8.0](https://github.com/nicholaschiang/site/compare/v1.7.1...v1.8.0) (2023-07-21)


### Features

* **routes/shows:** set look image aspect ratio ([d0367d2](https://github.com/nicholaschiang/site/commit/d0367d2e5d4c4734dfad84876a671950e89b015c))

## [1.7.1](https://github.com/nicholaschiang/site/compare/v1.7.0...v1.7.1) (2023-07-20)


### Bug Fixes

* **routes/show:** always show accurate review count ([4fd2ce6](https://github.com/nicholaschiang/site/commit/4fd2ce634a24f61a7936f8314a5442e18f11dc55))

## [1.7.0](https://github.com/nicholaschiang/site/compare/v1.6.0...v1.7.0) (2023-07-20)


### Features

* **scraper:** add hermes fashion show ([d29e35a](https://github.com/nicholaschiang/site/commit/d29e35ab26c43c1a6f1c9d16f2017f60af577fec))


### Bug Fixes

* **routes/shows:** remove image alt text ([4c9eddf](https://github.com/nicholaschiang/site/commit/4c9eddff7ac1541abe609b14bed6831fa024b641))

## [1.6.0](https://github.com/nicholaschiang/site/compare/v1.5.0...v1.6.0) (2023-07-20)


### Features

* add serif fonts for decorative headers ([78a8530](https://github.com/nicholaschiang/site/commit/78a8530ecaa6885636e72fafab13f72021f93466))
* **app/app.css:** use royal green color ([fa1d163](https://github.com/nicholaschiang/site/commit/fa1d163271f959e95dfbd2eb9a0dda21e1d0daf3))
* **atoms/empty:** add `<Empty>` component ([c7b0b57](https://github.com/nicholaschiang/site/commit/c7b0b5729b00d0ebf4f5b7cf8058a8363c96a519))
* **prisma/schema:** add shows, looks, and reviews ([82ae45f](https://github.com/nicholaschiang/site/commit/82ae45fec8f7738809a83f9574c4cbcdecb511af))
* **prisma:** update show models and add migration ([1d171c1](https://github.com/nicholaschiang/site/commit/1d171c19fa6a0f51e6aaa4eca5f996455ed9a25f))
* replace univers font family with inter ([d457ec2](https://github.com/nicholaschiang/site/commit/d457ec23110dc579b7b6b3d6cce55e547c22cefa))
* **routes/index:** add link to `/shows` to home ([58d0d49](https://github.com/nicholaschiang/site/commit/58d0d49462aa3602d826da39e491ec08f804f44c))
* **routes/show:** add flowers for score icons ([6c24aeb](https://github.com/nicholaschiang/site/commit/6c24aebac91542699ce688c97130141edda4b758))
* **routes/show:** add reviews from database ([d7711e2](https://github.com/nicholaschiang/site/commit/d7711e249b0b97f7487fc934a1ac08759111524f))
* **routes/show:** auto-play runway show video ([961bf61](https://github.com/nicholaschiang/site/commit/961bf6169ad0914102bbabec61390388176574d5))
* **routes/shows:** add a "shows" list page ([c0a8bea](https://github.com/nicholaschiang/site/commit/c0a8beacf097e9e7e4eb79bce5ff2daef4b5d78c))
* **routes/show:** show scores from database ([a658b32](https://github.com/nicholaschiang/site/commit/a658b3209df1ca70ab4626e03ef5b0619c5d0072))
* **routes:** add basic collections page ([90ec724](https://github.com/nicholaschiang/site/commit/90ec724d4c8504f06e4a82b8149ab0fdc4730212))
* **routes:** update collection page for shows ([5afd6ab](https://github.com/nicholaschiang/site/commit/5afd6ab71d89c91d847a409c31ed709b518038b0))
* **scraper/looks:** add reviews to show ([c25c059](https://github.com/nicholaschiang/site/commit/c25c0594525624c3acdd660224fef8b6062068bb))
* **scraper:** add script to create runway show ([f2ac9bf](https://github.com/nicholaschiang/site/commit/f2ac9bf546cfcd4a46cb6ea0c74f39645b872b00))


### Bug Fixes

* **app/app.css:** hide opening and closing quotes ([a65b4e9](https://github.com/nicholaschiang/site/commit/a65b4e939ca3dbb6db714cef1ce260d4abb7a5d2))
* **atoms/empty:** add dark mode border colors ([da69c5a](https://github.com/nicholaschiang/site/commit/da69c5a2d80c265727c7ea67b1246d70d176235a))
* **models/user.server:** user email is now optional ([86068b8](https://github.com/nicholaschiang/site/commit/86068b8182a80481734ad80041208a8a20e0931c))
* **prisma/schema:** combine all user-based tables ([1796b29](https://github.com/nicholaschiang/site/commit/1796b29976acf4b47969caf268c60c2618389a96))
* **prisma/schema:** make the look model optional ([1db6c17](https://github.com/nicholaschiang/site/commit/1db6c176f6bc73b172ffc23b6f0a7cf40f785413))
* **prisma:** make user fields optional ([af604bd](https://github.com/nicholaschiang/site/commit/af604bd27ef27d5951e01d90b6775f82decdbbe1))
* **routes/show:** move about to the left ([e6f05d8](https://github.com/nicholaschiang/site/commit/e6f05d81ca38b1df9094266efeafcab995e55e4a))
* **routes/show:** remove all rounded corners ([a58dff5](https://github.com/nicholaschiang/site/commit/a58dff56f4b7178920816ed87d152bc33e2ce4f5))
* **routes/show:** remove consumer review form ([b3f5c62](https://github.com/nicholaschiang/site/commit/b3f5c628c7c7d87e5c1fb4fc369b2759563eec4e))
* **scraper/show:** use `static.nicholas` image links ([1f14dd4](https://github.com/nicholaschiang/site/commit/1f14dd4edfaabd7e05a70b650fb11283462af510))
* **tailwind:** do not override `font-sans` ([e1f9446](https://github.com/nicholaschiang/site/commit/e1f944617aaaa2b8e509dc202939e75c55114554))

## [1.5.0](https://github.com/nicholaschiang/site/compare/v1.4.0...v1.5.0) (2023-06-18)


### Features

* **app/atoms:** add basic boilerplate components ([65ea616](https://github.com/nicholaschiang/site/commit/65ea616865cc84f94db934c86c80e66c7e1b619c))

## [1.4.0](https://github.com/nicholaschiang/site/compare/v1.3.2...v1.4.0) (2023-06-18)


### Features

* **components/dialog:** reduce border radius ([5e1f12e](https://github.com/nicholaschiang/site/commit/5e1f12ee5465150d80cd432b74defeb7d1397fa0))
* **routes:** add placeholder collection page ([b9f176b](https://github.com/nicholaschiang/site/commit/b9f176bb92be190a4f710e510b31880978ad375a))

## [1.3.2](https://github.com/nicholaschiang/site/compare/v1.3.1...v1.3.2) (2023-06-17)


### Bug Fixes

* **products:** replace search params instead of nav ([8c81dcc](https://github.com/nicholaschiang/site/commit/8c81dcc3392c6664fb8f493295195888796169f8))
* **products:** skip unnecessary search param change ([474832a](https://github.com/nicholaschiang/site/commit/474832a679f9336469a3d4fc68319220c496e791))

## [1.3.1](https://github.com/nicholaschiang/site/compare/v1.3.0...v1.3.1) (2023-05-09)


### Bug Fixes

* **vercel.json:** add cross-origin access headers ([bae6349](https://github.com/nicholaschiang/site/commit/bae63496c18c2529b9ba3d80629406737a8dcb35))

## [1.3.0](https://github.com/nicholaschiang/site/compare/v1.2.0...v1.3.0) (2023-04-06)


### Features

* **app/root:** add `vercel` page analytics ([385a794](https://github.com/nicholaschiang/site/commit/385a794500aaaaedd281a4ffcab05d86fa1f9d2f))
* report real web vital analytics to vercel ([4c77c7e](https://github.com/nicholaschiang/site/commit/4c77c7e402a6b221fcc172ca4e0c9363b861ff00))


### Bug Fixes

* **routes:** use `nanoid/non-secure` to avoid `crypto` ([5a825b0](https://github.com/nicholaschiang/site/commit/5a825b067681d634497c2efae99575e6ba872d23))
* use `@prisma/client/edge` for edge runtime ([ab44e66](https://github.com/nicholaschiang/site/commit/ab44e66515287f6932eb413eae3ba46a13f987b4))


### Performance Improvements

* **entry.server:** use swr cache control directive ([74bfa1e](https://github.com/nicholaschiang/site/commit/74bfa1e08c458a0abac11f6494df212d5d45ba7f))
* **routes:** use `vercel` edge functions ([9e29c6f](https://github.com/nicholaschiang/site/commit/9e29c6f34cf5b8d2e106dbe810576f9f80b27dcb))

## [1.2.0](https://github.com/nicholaschiang/site/compare/v1.1.0...v1.2.0) (2023-04-04)


### Features

* replace `@remix-run/node` with `@vercel/remix` ([430000b](https://github.com/nicholaschiang/site/commit/430000bc365348db2314900a1b40eea4467f2d63))
* use `vercel` built-in image optimization ([92e99bb](https://github.com/nicholaschiang/site/commit/92e99bb086d5816678cda0c5a0a2f840adc66a86))


### Bug Fixes

* **app/db:** remove `FLY_REGION` assumptions ([d4a7f0f](https://github.com/nicholaschiang/site/commit/d4a7f0f7198d1f16021937e4ad426945d5a849a7))
* **image:** only optimize images when deployed ([9e6ead1](https://github.com/nicholaschiang/site/commit/9e6ead152a0a50fea802909f680736836da6423b))


### Performance Improvements

* use `pgbouncer` to pool postgres connections ([32edb7b](https://github.com/nicholaschiang/site/commit/32edb7bb2c6d9314e25860ce1a7528f954eab830))

## [1.1.0](https://github.com/nicholaschiang/site/compare/v1.0.1...v1.1.0) (2023-04-01)


### Features

* **cypress:** add aritzia scraping script ([4eb1486](https://github.com/nicholaschiang/site/commit/4eb148661ad05fec6e98c890b2a89dd3c82d41b3))
* **filters:** add custom `<SizeItems>` component ([1896c2b](https://github.com/nicholaschiang/site/commit/1896c2b49dee7717a0a951a4e7fb31b21badeb7e))
* **filters:** show nested filter values ([7b800eb](https://github.com/nicholaschiang/site/commit/7b800eb3da3740b2d0ed24f3332f058b3a262264))
* **layout:** reduce x padding to match y ([451814f](https://github.com/nicholaschiang/site/commit/451814fb7ab74da8b117d9b2800d1de6e6f1977f))
* **menu:** simply extend the `cmdk` library ([4288a3c](https://github.com/nicholaschiang/site/commit/4288a3c38ff592ab609ed4edd079d8338b788d7e))
* **prisma/schema:** add materials and sustainability ([e8646c0](https://github.com/nicholaschiang/site/commit/e8646c01382fea9b3df7813c731e5aa259e48cc2))
* **prisma:** add unique product descriptions ([714e88e](https://github.com/nicholaschiang/site/commit/714e88e3247db4ffadeb05307a8e6d66b3e6f891))
* **product:** add basic product page to display info ([9a5ae6c](https://github.com/nicholaschiang/site/commit/9a5ae6c35663a87c6aedb5af0efb71497b29b696))
* **product:** make product page a dialog ([3551414](https://github.com/nicholaschiang/site/commit/3551414fe089325f2f581ae22354c7fdb19ef5fb))
* **products:** add join selector and count indicator ([70ee6ed](https://github.com/nicholaschiang/site/commit/70ee6ed8000b61408bff1bad935606dccd08de8b))
* **products:** show secondary image on hover ([e464dad](https://github.com/nicholaschiang/site/commit/e464dadfd438e2e5fe31ef87f1b82e79f528a1a7))
* **routes:** add max width to product page ([0f0fd5f](https://github.com/nicholaschiang/site/commit/0f0fd5fee9094ca7175c297242791d2e4747ae24))
* **scraper/src/ald:** add aime leon dore script ([f7f408e](https://github.com/nicholaschiang/site/commit/f7f408e4e7804059ff5ef43a9b14f958539d5bc0))
* **scraper:** add aritzia script and update marant ([d9730fb](https://github.com/nicholaschiang/site/commit/d9730fb3e19c32a191973982b1379a0d9aa5b8f5))
* **scraper:** save aritzia data to database ([2eecd23](https://github.com/nicholaschiang/site/commit/2eecd2330f540681cafc5cd9fccaa3f6bb948cdb))
* **scraper:** scrape aritzia sales prices ([7264d4d](https://github.com/nicholaschiang/site/commit/7264d4dcf7d1d9cbeea649780f752f4043e38aec))
* **scraper:** use scrapy to get aritzia products ([2dd308e](https://github.com/nicholaschiang/site/commit/2dd308e24bc0fd9737e89eeb9346a3671708c6b7))


### Bug Fixes

* address typescript compilation errors ([fc1caae](https://github.com/nicholaschiang/site/commit/fc1caaeea8548c218a02d95c96a2b8beede3be6c))
* **app.css:** optimize text for legibility ([50a434d](https://github.com/nicholaschiang/site/commit/50a434d79b5f83ee5dd025763dad5b2cfecb562c))
* **app/products:** only show hover image if it exists ([8d11083](https://github.com/nicholaschiang/site/commit/8d11083b958cbd4542d46ced7430b89b9a7bd178))
* **app/routes/product:** address eslint errors ([5c17b9e](https://github.com/nicholaschiang/site/commit/5c17b9e56204d01a5280555e36023f61e0420741))
* filtering by variant is just filtering by color ([21e6ce8](https://github.com/nicholaschiang/site/commit/21e6ce8ba9baf5ed591ce53dd0fffd5106f4d03c))
* **filters:** close filter menu on item select ([dcda774](https://github.com/nicholaschiang/site/commit/dcda774e5737bc572b1eb1b9f80cc4179d578695))
* **routes/product:** add fallback image placeholder ([0dace9b](https://github.com/nicholaschiang/site/commit/0dace9b5b73aab44bf9e09faf751d3fbf7df9ff7))


### Performance Improvements

* **app/routes/layout:** limit to 100 results ([59bf1f5](https://github.com/nicholaschiang/site/commit/59bf1f58f760823a7fe106c54c558c842683d458))
* **filters:** reuse already mounted field items ([b194b36](https://github.com/nicholaschiang/site/commit/b194b36b3ee1998bc642b63be4a55b418a130133))

## [1.0.1](https://github.com/nicholaschiang/site/compare/v1.0.0...v1.0.1) (2023-03-21)


### Bug Fixes

* **components/filters:** preserve scalar types ([632fabe](https://github.com/nicholaschiang/site/commit/632fabefa609f0579c328b4c5f1972add6657d85))

## 1.0.0 (2023-03-21)


### Features

* add basic prisma-based product filters ([9bf2a4e](https://github.com/nicholaschiang/site/commit/9bf2a4e01ad8e97a9e9e731d642f8c2637464cd7))
* add cookie based theme support ([e2f4895](https://github.com/nicholaschiang/site/commit/e2f4895b4a3ad6901ac8d308aef6afdafd0b27b9))
* add hotkeys and tooltips describing them ([209d7a3](https://github.com/nicholaschiang/site/commit/209d7a35fab4c0d1cddada9a9d0da59531b9f547))
* **app/root:** update website title in meta tags ([33596cc](https://github.com/nicholaschiang/site/commit/33596cc88d217709b9e7774422515da04215e43d))
* **app:** update join page for new user model ([8c8cbbc](https://github.com/nicholaschiang/site/commit/8c8cbbcdb786847d31447540843a956eb3603b2c))
* **components/filters:** lighten dialog background ([99ee048](https://github.com/nicholaschiang/site/commit/99ee04885e7a07d17640461476604fc7cd7a5592))
* **components/menu:** set placeholder text color ([846f65b](https://github.com/nicholaschiang/site/commit/846f65b8dea75c5c3e0083032645ee0c60e96f80))
* **components/tooltip:** add collision padding ([a6b3a42](https://github.com/nicholaschiang/site/commit/a6b3a42d03e6806c0ed7f6c432ec12f64efb2dad))
* **data/marant:** add latest scraping with images ([6b93c13](https://github.com/nicholaschiang/site/commit/6b93c13d9767d1aab87760db66934598bb51e66c))
* **data:** save scraped product info as JSON ([1bf7e45](https://github.com/nicholaschiang/site/commit/1bf7e4532f3f667a7033660cc40d85faa55d1542))
* **entry.client:** log "stay curious" message ([3633969](https://github.com/nicholaschiang/site/commit/3633969e220cc7b79349c19c83b2f792d6a861bc))
* **filters:** add `f` and `shift+f` filter hotkeys ([4699671](https://github.com/nicholaschiang/site/commit/46996718dd6f72dba91fbc920c80c45354f9ef39))
* **filters:** add dialog based `<ScalarMenu>` ([034cb2f](https://github.com/nicholaschiang/site/commit/034cb2f524c5e296c406ada9f2a39f9261dc5798))
* **filters:** add user-friendly filter strings ([6b83016](https://github.com/nicholaschiang/site/commit/6b830168e1a6a36960105ba07f09c362353c6962))
* **index:** remove cheese timeline events ([7f8c0bc](https://github.com/nicholaschiang/site/commit/7f8c0bc31f71ac216e1bf3c7c7353750a406c45f))
* **layout:** center header text and link to portfolio ([ef7f508](https://github.com/nicholaschiang/site/commit/ef7f5088d99ba005ff6f4e8757db028855b87e8b))
* **layout:** only scroll within product list container ([428dbcd](https://github.com/nicholaschiang/site/commit/428dbcd97c586e6ffa993a9a43ad076d5d4cec98))
* **life:** add weeks in a lifetime diagram files ([a7e109d](https://github.com/nicholaschiang/site/commit/a7e109d947c4c227920fc5d8104fdcb737dd53b5))
* **menu:** customize input placeholder per menu ([b0dadac](https://github.com/nicholaschiang/site/commit/b0dadacc65400e4259a54acb45d6e5a59f668874))
* polish error display with custom mono font ([d1c03dc](https://github.com/nicholaschiang/site/commit/d1c03dcfcb9741c44c2ccf99f54b587cbd209b9e))
* polish theme and add homepage timeline ([02cb669](https://github.com/nicholaschiang/site/commit/02cb66914881089868eb9002ec4684c38b3f7617))
* **prisma/schema:** add basic fashion data models ([ea768ce](https://github.com/nicholaschiang/site/commit/ea768cee5be07c87e9bcbc9de46dddbb67996607))
* **prisma/schema:** add prices, retailers, sizes, etc ([8c5aec3](https://github.com/nicholaschiang/site/commit/8c5aec3972710d361f8b1bfd34b45a0091a979ab))
* **prisma:** add product colors and pricing ([eee390d](https://github.com/nicholaschiang/site/commit/eee390d2d57410adef0bdf4fa06ed03b07bdd811))
* **prisma:** add product images and videos ([1a1be82](https://github.com/nicholaschiang/site/commit/1a1be826f3cdd062d4504f609c4e075a098b07ad))
* **prisma:** add product variant data model ([2bfb65a](https://github.com/nicholaschiang/site/commit/2bfb65a117edb32093660438133a3302f3a1801c))
* **prisma:** add temporary unique constraints ([f660004](https://github.com/nicholaschiang/site/commit/f6600040e9c15af09edbd4875d71cce5ffcbedb9))
* **prisma:** make product-collections many-to-many ([e71033f](https://github.com/nicholaschiang/site/commit/e71033f9df89b23749d50f13d64e533bbdc87e9f))
* **prisma:** replace `Category` with `Style` model ([2e56428](https://github.com/nicholaschiang/site/commit/2e56428d5c355116248a78fbd166f27ae805a9a9))
* **prisma:** temporarily make product names unique ([22d30ed](https://github.com/nicholaschiang/site/commit/22d30ed1fb60f067054e73aebd94ceb62651dd15))
* **products:** add results per row input ([b1a357e](https://github.com/nicholaschiang/site/commit/b1a357e8ccc11fc1057b69b5d474357454970d74))
* **products:** add search parameter filtering ([1cf5f4c](https://github.com/nicholaschiang/site/commit/1cf5f4ced4873df7c7e5ba6ea7a02cd3c9fa98bf))
* **products:** create basic products list page ([39de2fe](https://github.com/nicholaschiang/site/commit/39de2fed730c017b6cf4385526ea3992d80102f6))
* **products:** remove border from product images ([83b86b1](https://github.com/nicholaschiang/site/commit/83b86b15e8907acba3e9ba7829b1d8b26f6dbe7b))
* **products:** use `framer-motion` for animations ([957f578](https://github.com/nicholaschiang/site/commit/957f578f175690e689cb30329c29071610b7b627))
* **products:** use radix ui to build filter menu ([5864690](https://github.com/nicholaschiang/site/commit/586469000bc03f16f4a947d46c7020cd8587dabf))
* **products:** use zoom buttons for `resultsPerRow` ([719c81a](https://github.com/nicholaschiang/site/commit/719c81ae350d79f21ec4a26cee7cef6432bf5110))
* **public/data/marant:** download product images ([faa85d4](https://github.com/nicholaschiang/site/commit/faa85d49e16cbf0bc0211390e2f02e761e22541a))
* replace icons with radix ui components ([3b96e91](https://github.com/nicholaschiang/site/commit/3b96e91043a4b2e57a7f47e0ebe5b6ed8c527508))
* **routes/index:** center timeline vertically ([b842fbb](https://github.com/nicholaschiang/site/commit/b842fbb07e7ef801e86bc87fa85e996b4a207e42))
* **routes/index:** replace remix blues template docs ([2d62277](https://github.com/nicholaschiang/site/commit/2d62277d21ba877e1ed7899359c5062bbe96fc34))
* **routes/index:** use `<CardStackIcon>` for products ([21b1aa8](https://github.com/nicholaschiang/site/commit/21b1aa8e3c8646dc2c98418ee5d8656f95fee526))
* **routes/layout:** add arrow icon to header link ([9a447e0](https://github.com/nicholaschiang/site/commit/9a447e02f362f806a881f99019cd462532a4ea72))
* **routes/products:** add custom styling to img alt ([990cd5d](https://github.com/nicholaschiang/site/commit/990cd5dbeb9d6dd417b9010aad4676c6b5c7a9c7))
* **routes/products:** decrease img alt bg contrast ([cc7e4b7](https://github.com/nicholaschiang/site/commit/cc7e4b7c07d304d5b86b880959f2bc861214d697))
* **routes:** add basic product placeholder page ([f2a922e](https://github.com/nicholaschiang/site/commit/f2a922e0dde3d8d6afcd4df2e53fd5eaaa3143de))
* **routes:** add placeholders for all product fields ([03da9e9](https://github.com/nicholaschiang/site/commit/03da9e9cc939e0e3472bf754ab2f436e434b73ab))
* **schema:** add tiers, levels, and price sizes ([dec7e13](https://github.com/nicholaschiang/site/commit/dec7e13f2487d6949fc01fc4993f7688b85aed64))
* **scraper/marant:** add `url` parameter to `scrape` ([8916874](https://github.com/nicholaschiang/site/commit/89168746e417b3a2f673b01a9c557661112c4088))
* **scraper/marant:** save product images locally ([515f1e1](https://github.com/nicholaschiang/site/commit/515f1e1270a367df9135ad64f6f2e2de04adca12))
* **scraper/marant:** save scraped data to postgres ([c9e835f](https://github.com/nicholaschiang/site/commit/c9e835f696b1d1c424192086015a6e53cfe605b4))
* **scraper/marant:** save the largest product images ([eed97b0](https://github.com/nicholaschiang/site/commit/eed97b0b98e3a0d1d677fef53140f47db7042a10))
* **scraper/marant:** wait for all products to load ([bee60de](https://github.com/nicholaschiang/site/commit/bee60de4a3668a220a3bff572b083fef3eedd0b3))
* **scraper:** add `pino` logs and `user-agents` spoofing ([76ebba2](https://github.com/nicholaschiang/site/commit/76ebba2cd70e1d664ba75b2e2405b45c93edc3a9))
* **scraper:** add filter-based puppeteer scraping ([5214f3b](https://github.com/nicholaschiang/site/commit/5214f3b1007793b66c99e16a803beae724f1e797))
* **scraper:** add script for isabel marant ([5f39b54](https://github.com/nicholaschiang/site/commit/5f39b544663aecdb7cdaf618edaa4135cdb29c54))
* **scraper:** finish basic marant scraping ([dc7c0a7](https://github.com/nicholaschiang/site/commit/dc7c0a7453c07a52f1fcb1e9bf2b04b2c0427941))
* **scraper:** use puppeteer to enable interactions ([a5f7477](https://github.com/nicholaschiang/site/commit/a5f7477e1069fa8018445f72eb80ef29d76e1164))
* **scraping:** use node es module imports ([ff3da04](https://github.com/nicholaschiang/site/commit/ff3da04776c2693e61656be248a95719e4e74bcb))
* use custom univers font family ([9e1ebb7](https://github.com/nicholaschiang/site/commit/9e1ebb7b8957dc780c1a7707404550e785d86d62))


### Bug Fixes

* **app/root:** add `max-h-full` to custom error display ([59a781d](https://github.com/nicholaschiang/site/commit/59a781da3d5a20ef141429d83a29a80c1eaf740b))
* **app/root:** remove unnecessary `<StrictMode>` ([ee20e5f](https://github.com/nicholaschiang/site/commit/ee20e5f2570dac493db2d75db7bd1696cc7e0890))
* **components/filters:** address `FilterName` type errors ([5c72781](https://github.com/nicholaschiang/site/commit/5c72781224d361ae46f296c2aef7ba9ac5ead3ff))
* **components/menu:** don't case match ([a4aa7e8](https://github.com/nicholaschiang/site/commit/a4aa7e8636c3c48a7ed3d9d203218f4d66b771ea))
* **components/menu:** ensure cursor is pointer ([20ed106](https://github.com/nicholaschiang/site/commit/20ed1067a897bafa7dd4b8357f1bb2b347d64976))
* **components/menu:** mark `hotkey` prop as optional ([79bd9e2](https://github.com/nicholaschiang/site/commit/79bd9e20486d0dd8eaf25b53c0ca5d5bad4eb5bb))
* **components/menu:** use the `combobox` a11y role ([a17fb0c](https://github.com/nicholaschiang/site/commit/a17fb0c7729dfa46357713a30a2d79f081db859c))
* **components:** remove `autoFocus` prop for a11y ([01c5b10](https://github.com/nicholaschiang/site/commit/01c5b10fe1d89ae1db060b4d1308b1b35b68889e))
* **filter:** place `<Menu>` inside `<AnimatePresence>` ([369daab](https://github.com/nicholaschiang/site/commit/369daab361871812f086e48cdf48bc1db9a9ecff))
* **prisma:** make image and video urls unique ([f1f618f](https://github.com/nicholaschiang/site/commit/f1f618fce7d5af66bc4eb6d5d813b2e83a3bcb48))
* **routes/theme:** remove hard-coded `/` redirect ([f86631a](https://github.com/nicholaschiang/site/commit/f86631a53d9a73924303ef92afe6b157b6a7a554))
* **scraper/marant:** ensure clear filters is clicked ([bf9777a](https://github.com/nicholaschiang/site/commit/bf9777a9f261e7352a65d67d6a3a8b1d8830b552))
* **scraper/marant:** fetch the largest image sizes ([b9674d3](https://github.com/nicholaschiang/site/commit/b9674d335235f1fb3f37da2a06cdf615a6045774))


### Performance Improvements

* don't optimize images to reduce compute costs ([e9a6bb1](https://github.com/nicholaschiang/site/commit/e9a6bb121c5fb31f8bef47e8658d175bce9d63ee))
* **products:** lazily load images and add srcset widths ([34f57ca](https://github.com/nicholaschiang/site/commit/34f57ca35f103f37ce52ee801ffb385e5ba7fda4))
* **scraper:** combine concurrent recursive scraping ([5b38e29](https://github.com/nicholaschiang/site/commit/5b38e291102d28990f3c9891550ab3cf0bb71591))
* use `sharp` for runtime image optimization ([52f62fc](https://github.com/nicholaschiang/site/commit/52f62fce291c2cd66b72748f21d8113d4e2fa372))
