# `scraper`

The goal of this directory is to implement some very light-weight and fast web scraping to populate our fashion database.

## Technology

### `browser`

While using Python for web scraping is more widely adopted than using Node.js (e.g. Beautiful Soup or Scrapy are popular options), there are a few shortcomings that can only be overcome via a headless browser:

- Lazy loaded images won't show up when scraping pure HTML responses. Intelligent lazy loading also requires a user to scroll to the bottom of the page before all the images are loaded.
- Many of the e-commerce sites I wish to scrape employ advanced anti-bot protections (e.g. PerimiterX) that are more easily bypassed when using a headless browser.
- The majority of the data I wish to scrape requires many user interactions (i.e. updating filters) that may not always be included in e.g. URL query parameters.
- It would be really nice to simply scrape a website's API. This is, however, impossible with most of the sites I wish to scrape as they are solely SSR and expose no client-side data fetching.
- I am also more familiar with Node.js + TS than Python, resulting in slightly faster development.

### `script`

For scraping tasks that do not require running JS and avoiding bot protection tools, using Python-based scraping solutions can be significantly faster.
This directory contains a Scrapy project designed just for that.
