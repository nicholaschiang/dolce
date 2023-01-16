import { Cluster } from 'puppeteer-cluster';
import type { Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { pino } from 'pino';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());

const log = pino({ level: 'debug' });

async function loadPage(
  page: Page,
  url = 'https://www.isabelmarant.com/nz/isabel-marant/men/im-all-man'
) {
  log.info('Loading page... %s', url);
  page.on('console', (msg) => log.trace(msg.text()));
  await page.goto(url, { waitUntil: 'networkidle0' });
  log.debug('Loaded page: %s', url);
  return page;
}

async function openFiltersPanel(page: Page) {
  log.info('Opening filters panel...');
  const filterButtonSel = 'button.filtersPanelTrigger';
  await page.waitForSelector(filterButtonSel);
  await page.click(filterButtonSel);
  await page.waitForSelector(
    'div.filtersPanelWrapper.open:not(.velocity-animating) > div.filtersPanel'
  );
  log.debug('Opened filters panel.');
}

type Filter = {
  title: string;
  name?: string;
  url?: string;
  groupIdx: number;
  idx: number;
};

const filterGroupsSel = 'ul.filterGroups:nth-of-type(2) > li.filterGroup';

async function getFilters(page: Page, title = 'Category'): Promise<Filter[]> {
  log.info('Getting filters... (%s)', title);
  const filters = await page.evaluate(
    (sel, desiredFilterGroupTitle) => {
      const filterGroupEls = document.querySelectorAll(sel);
      return Array.from(filterGroupEls)
        .map((filterGroupEl, groupIdx) => {
          const filterGroupTitle = filterGroupEl
            .querySelector('div.title')
            ?.textContent?.trim();
          if (filterGroupTitle !== desiredFilterGroupTitle) return [];
          const filterEls = filterGroupEl.querySelectorAll(
            'ul.refinements > li:not(.disabled)'
          );
          return Array.from(filterEls).map((filterEl, idx) => ({
            name: filterEl.querySelector('a > span.text')?.textContent?.trim(),
            url: filterEl.querySelector('a')?.href,
            title: filterGroupTitle,
            groupIdx,
            idx,
          }));
        })
        .flat()
        .filter((filter) => filter.name);
    },
    filterGroupsSel,
    title
  );
  return filters;
}

async function clickFilter(page: Page, filter: Filter) {
  log.info('Clicking filter: (%s: %s)', filter.title, filter.name);
  const filterSel =
    `${filterGroupsSel}:nth-child(${filter.groupIdx + 1}) ` +
    `ul.refinements > li:nth-child(${filter.idx + 1})`;
  log.debug('Filter (%s) selector: %s', filter.name, filterSel);
  await page.waitForSelector(filterSel);
  await page.$eval(`${filterSel} > a span`, (el) => el.click());
  await page.waitForSelector(`${filterSel}.selected`);
  log.debug('Clicked filter: (%s: %s)', filter.title, filter.name);
}

export async function scrape() {
  const cluster = await Cluster.launch({
    puppeteer,
    puppeteerOptions: {
      headless: false,
      executablePath: '/opt/homebrew/bin/chromium',
    },
    maxConcurrency: 1,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
  });

  cluster.on('taskerror', (err, data) => {
    log.error('Error crawling %o \n %s', data, (err as Error).stack);
  });

  // For every category:
  // 1. open this page;
  // 2. open the filters panel;
  // 3. click the category filter;
  // 4. for every color:
  //    1. open the page;
  //    2. open the filters panel;
  //    3. click the color filter;
  //    4. for every size:
  //       1. open the page;
  //       2. open the filters panel;
  //       3. click the size filter;
  //       4. for every season:
  //          1. open the page;
  //          2. open the filters panel;
  //          3. click the season filter;
  //          4. get the products shown (which will have the corresponding category, color, size, and season).

  async function task({
    page,
    data: { filtersToGet, existingFilters },
  }: {
    page: Page;
    data: { filtersToGet: string[]; existingFilters: Filter[] };
  }) {
    await loadPage(page);
    await openFiltersPanel(page);
    /* eslint-disable-next-line no-restricted-syntax */
    for await (const filter of existingFilters) await clickFilter(page, filter);
    if (filtersToGet.length === 0) {
      log.info(
        'No more filters to get; extracting product information... %s',
        existingFilters.map((f) => `(${f.title}: ${f.name})`).join(', ')
      );
    } else {
      const filters = await getFilters(page, filtersToGet[0]);
      log.debug(
        'Found %d %s filters for %s: %s',
        filters.length,
        filtersToGet[0],
        existingFilters.map((f) => `(${f.title}: ${f.name})`).join(', '),
        filters.map((f) => f.name).join(', ')
      );
      filters.forEach((filter, idx) => {
        if (idx > 1)
          log.debug(
            'Temporarily skipping filter: (%s: %s)',
            filter.title,
            filter.name
          );
        else
          void cluster.queue({
            filtersToGet: filtersToGet.slice(1),
            existingFilters: [...existingFilters, filter],
          });
      });
    }
  }

  await cluster.task(task);
  await cluster.queue({
    filtersToGet: ['Category', 'Color', 'Size', 'Season'],
    existingFilters: [],
  });

  await cluster.idle();
  await cluster.close();
}
