# `site`

A landing page for everything I love.
Often used as a sort of guinea pig for testing technologies before I use them in more important enterprise projects.

## Rotten Tomatoes for Fashion

The `/shows` feature of this project is Rotten Tomatoes for fashion.

### What is the Critic Score?

The Critic Score—based on the opinions of hundreds of fashion critics—is a trusted measurement of critical recommendation for millions of consumers.

The Critic Score represents the percentage of professional critic reviews that are positive for a given runway show.
A Critic Score is calculated for a runway show after it receives at least five reviews.

#### Positive 

When at least 60% of reviews for a runway show are positive, a blossoming rose is displayed to indicate its Positive status.

#### Negative 

When less than 60% of reviews for a runway show are positive, a dead rose is displayed to indicate its Negative status.


#### Unknown

When there is no Critic Score available, which could be because the show hasn’t aired yet or there are not enough ratings to generate a score, a gray rose is displayed.

### Curation

I collect runway show pictures, reviews, and related data every week, generating Critic Scores.
I manually copy-and-paste information into `static` and import that data into Postgres using a sequence of scripts.
I often use machine learning tools to assist in the curation, summarization, and sentiment analysis process.
A more advanced web scraping setup is probably appropriate, but doing so would be quite difficult given the anti-bot measures most fashion websites employ.

### What is the Consumer Score?

The Consumer Score represents the percentage of users who have rated a runway show or collection positively.
Right now, this is open to the public: anyone can create an account and submit their opinion.
Eventually, I may gate this ability behind a purchase: users must first verify that they have bought a product before they can be counted amongst the "consumers" and submit a review.

## The Fashion Index

The ultimate goal of this project is to create an interface that I can use to objectively rank and queue up high fashion purchases.
I want an organized browser of the world of fashion.

#### Ex: Top-down view of EVERYTHING about a product.

It would be super cool IMO to open a product page and, in addition to seeing sizing, images, modeling, prices (from the various retailers that stock said item), one could also see the designer who made it (and easily see what else that designer has made and what other companies that designer has worked for), the company that owns the product's brand (and recent financial news regarding said corporation), etc.

#### Ex: Product comparisons like Apple.

It could also be cool to be able to match up similar products from different brands (as most brands' ready-to-wear collections will typically follow similar trends and thus contain similar pieces) in a side-by-side feature comparison view (similar to how you can compare different Apple products before making a decision on which one to buy): e.g. you could open up a Dior sweater and a GUCCI sweater side-by-side and make your purchase decision not only based on price or material sourcing or factory location or designer but also by the brand's reputation index (a.k.a. if resale value might increase) or a corporations climate change policies (or the lack thereof).

### Implementation

To implement features like that, I'll need a really good database schema (see [#1](https://github.com/nicholaschiang/site/pull/1)). And then all that needs to be done is:

- [ ] figuring out where and how to scrape all of this data (ideally I want all past collections as well);
- [ ] building a basic page-based application with all of this data (perhaps using ISG from Next.js or similar).

### Pages

The initial MVP will only contain a few pages (see [#4](https://github.com/nicholaschiang/site/pull/4)):

- [ ] a basic `/products` page that lets users see a massive list of all the products in our database (and filter them using Linear style filters... filter sets can be saved as "views");
- [ ] a `/products/{id}` page that lets users see all the details of a particular product (prices, sizes, collections, variants, brands, companies, countries, runway shows, etc);
- [ ] a `/views` page that shows a list of the user's views that they've saved from `/products` filters (these are essentially just sets of filters);
- [ ] a `/views/{id}` page that is the same as the `/products` page but clicking the "Save" button updates the view instead of creating a new view (and trying to navigate away from the page after changing filters and not saving will surface a warning asking the user if they'd like to save their changes).

The initial [Figma mockup](https://www.figma.com/file/ywAIsTAX7LPEKWpd0IpZtg/DRIP?node-id=1%3A3&t=G0xjG4AfLi1dUXMn-1) of the `/products` page (inspired by Linear's issues filtering features):

![image](https://user-images.githubusercontent.com/20798889/215310276-b55f86ef-1860-4910-bd1a-9d9af6dfa937.png)

## Git Workflow

This repository's git workflow is inspired from [traditional gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow):

- `prod` is the production branch that is deployed to production on push;
- `main` is the default development branch that is deployed to staging on push;
- `<username>/<issue>` are the feature and bug fix branches that we use for day-to-day development (see below).

To work on something and deploy to staging:

1. make sure there is a [Linear](https://linear.app) ticket for it;
2. create a new branch `<username>/<issue>` (e.g. `nicholas/ns-1660` or, if you prefer more readable branch names, `nicholas/data-loading`);
3. commit changes to that branch early and often, following [the conventional commit message format](https://www.conventionalcommits.org/en/v1.0.0/);
4. create a new PR to merge your branch into `main` and request the desired reviewers (at least one must be a code owner;
5. once that PR is merged into `main`, your changes will be deployed to staging and Linear will automatically close the corresponding ticket.

To deploy to production:

1. merge `main` into `prod`.

## Technology

This site was bootstrapped using the Remix Blues Stack. Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix@latest --template remix-run/blues-stack
```

### What's in the stack

- [Multi-region Fly app deployment](https://fly.io/docs/reference/scaling/) with [Docker](https://www.docker.com/)
- [Multi-region Fly PostgreSQL Cluster](https://fly.io/docs/getting-started/multi-region-databases/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

### Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up, Postgres started, and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/blues-stack/tree/main)

### Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  pnpm docker
  ```

  > **Note:** The pnpm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  pnpm run setup
  ```

- Run the first build:

  ```sh
  pnpm build
  ```

- Start dev server:

  ```sh
  pnpm dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

If you'd prefer not to use Docker, you can also use Fly's Wireguard VPN to connect to a development database (or even your production database). You can find the instructions to set up Wireguard [here](https://fly.io/docs/reference/private-networking/#install-your-wireguard-app), and the instructions for creating a development database [here](https://fly.io/docs/reference/postgres/).

#### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

### Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create nicholas-eng
  fly apps create nicholas-eng-staging
  ```

  > **Note:** Once you've successfully created an app, double-check the `fly.toml` file to ensure that the `app` key is the name of the production app you created. This Stack [automatically appends a unique suffix at init](https://github.com/remix-run/blues-stack/blob/4c2f1af416b539187beb8126dd16f6bc38f47639/remix.init/index.js#L29) which may not match the apps you created on Fly. You will likely see [404 errors in your Github Actions CI logs](https://community.fly.io/t/404-failure-with-deployment-with-remix-blues-stack/4526/3) if you have this mismatch.

- Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Specify the `OPTIMIZE_IMAGES` feature flag, to do this you can run the following commands:

  ```sh
  fly secrets set OPTIMIZE_IMAGES=true --app nicholas-eng
  fly secrets set OPTIMIZE_IMAGES=false --app nicholas-eng-staging
  ```

  > **Note:** Enabling this feature flag will dramatically increase CPU/RAM load; your application may OOM and you may incur unexpectedly high compute costs (~$100 for two `shared-cpu-1x` on Fly.io for the additional RAM, shared CPU seconds, and SSD storage required for image optimization).
  >
  > It is recommended to disable this flag in staging and only enable it in production if your deployment target supports it (e.g. you'll probably want to scale up from `shared-cpu-1x` to prevent OOMs) and you are willing to pay the extra compute costs for the slight performance boost to the end-user.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app nicholas-eng
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app nicholas-eng-staging
  ```

  > **Note:** When creating the staging secret, you may get a warning from the Fly CLI that looks like this:
  >
  > ```
  > WARN app flag 'nicholas-eng-staging' does not match app name in config file 'nicholas-eng'
  > ```
  >
  > This simply means that the current directory contains a config that references the production app we created in the first step. Ignore this warning and proceed to create the secret.

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a database for both your staging and production environments. Run the following:

  ```sh
  fly postgres create --name nicholas-eng-db
  fly postgres attach --app nicholas-eng nicholas-eng-db

  fly postgres create --name nicholas-eng-staging-db
  fly postgres attach --app nicholas-eng-staging nicholas-eng-staging-db
  ```

  > **Note:** You'll get the same warning for the same reason when attaching the staging database that you did in the `fly set secret` step above. No worries. Proceed!

Fly will take care of setting the `DATABASE_URL` secret for you.

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

#### Multi-region deploys

Once you have your site and database running in a single region, you can add more regions by following [Fly's Scaling](https://fly.io/docs/reference/scaling/) and [Multi-region PostgreSQL](https://fly.io/docs/getting-started/multi-region-databases/) docs.

Make certain to set a `PRIMARY_REGION` environment variable for your app. You can use `[env]` config in the `fly.toml` to set that to the region you want to use as the primary region for both your app and database.

##### Testing your app in other regions

Install the [ModHeader](https://modheader.com/) browser extension (or something similar) and use it to load your app with the header `fly-prefer-region` set to the region name you would like to test.

You can check the `x-fly-region` header on the response to know which region your request was handled by.

### GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

### Testing

#### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `pnpm test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login()
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser()
})
```

That way, we can keep your local db clean and keep your tests isolated from one another.

#### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

#### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `pnpm typecheck`.

#### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

#### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `pnpm format` script you can run to format all files in the project.
