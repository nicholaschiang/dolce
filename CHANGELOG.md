# Release Notes

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
