# base node image
FROM node:18-bullseye-slim as base
RUN corepack enable

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV PORT 8080

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /site

ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app
FROM deps as build

WORKDIR /site

ADD prisma .
RUN pnpm prisma generate

ADD . .
RUN pnpm build

# Finally, build the production image with minimal footprint
FROM base

RUN mkdir /site
WORKDIR /site

COPY --from=build /site/node_modules /site/node_modules
COPY --from=build /site/tsconfig.json /site/tsconfig.json
COPY --from=build /site/package.json /site/package.json
COPY --from=build /site/build /site/build
COPY --from=build /site/public /site/public
COPY --from=build /site/prisma /site/prisma
COPY --from=build /site/app /site/app

EXPOSE 8080

CMD ["pnpm", "start"]
