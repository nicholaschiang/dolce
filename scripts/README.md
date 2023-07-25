# `scripts`

The goal of this directory is to implement some very light-weight and fast web scraping to populate our fashion database.

## Technology

### `node`

While using Python for web scraping is more widely adopted than using Node.js (e.g. Beautiful Soup or Scrapy are popular options), there are a few shortcomings that can only be overcome via a headless browser:

- Lazy loaded images won't show up when scraping pure HTML responses. Intelligent lazy loading also requires a user to scroll to the bottom of the page before all the images are loaded.
- Many of the e-commerce sites I wish to scrape employ advanced anti-bot protections (e.g. PerimiterX) that are more easily bypassed when using a headless browser.
- The majority of the data I wish to scrape requires many user interactions (i.e. updating filters) that may not always be included in e.g. URL query parameters.
- It would be really nice to simply scrape a website's API. This is, however, impossible with most of the sites I wish to scrape as they are solely SSR and expose no client-side data fetching.
- I am also more familiar with Node.js + TS than Python, resulting in slightly faster development.

### `python`

For scraping tasks that do not require running JS and avoiding bot protection tools, using Python-based scraping solutions can be significantly faster.
This directory contains a Scrapy project designed just for that.

To run the `python/spiders/aritzia_spider.py` to get product information from [Aritzia](https://aritzia.com) in JSON format:

```
$ poetry install
$ source .venv/bin/activate
$ cd scripts
$ scrapy crawl aritzia -L INFO -O json/aritzia.json
```

## Targets

### Vogue

To save show data from Vogue, simply edit the `spiders/vogue.py` spider `start_urls` to point to the latest fashion shows list page.
Then, (assuming you've already run `poetry install` to install the required Python dependencies) run the spider to download the show data to a `shows.json` file:

```
$ scrapy crawl vogue -O shows.json
```

To import that JSON file into Postgres, simply move it to `public/data/vogue/shows.json` (or, alternatively, you can edit the `node/save/vogue.ts` file's `PATH` constant to point to the relative path of `shows.json`) and then run the save script:

```
$ tsc -p scripts/node
$ node scripts/node/out/vogue.js | pino-pretty
```  
