# base node image
FROM node:22-bullseye-slim as base
RUN corepack enable
WORKDIR /site

# set for base and all layer that inherit from it
ENV PORT 8080
ENV PUPPETEER_SKIP_DOWNLOAD true

# install openssl for prisma
RUN apt-get update && apt-get install -y openssl

# install all node_modules, including dev dependencies
FROM base as build

ADD pnpm-lock.yaml .
RUN pnpm fetch

ADD package.json .
RUN pnpm install

# build the app
ADD . .
RUN pnpm run build

# setup production node_modules
RUN pnpm prune --prod

# finally, build the production image with minimal footprint
FROM base
WORKDIR /site

COPY --from=build /site/node_modules /site/node_modules

COPY --from=build /site/build /site/build
COPY --from=build /site/public /site/public
ADD . .

EXPOSE 8080

CMD node build/server.js 
