import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { pino } from 'pino';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());

const log = pino({ level: 'debug' });

export async function scrape() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/opt/homebrew/bin/chromium',
  });
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');

  // Type into search box.
  await page.type('.devsite-search-field', 'Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gs-title';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel)).map((anchor) => {
      const title = anchor.textContent?.split('|')[0].trim();
      return `${title ?? 'N/A'} - ${(anchor as HTMLAnchorElement).href}`;
    });
  }, resultsSelector);

  // Print all the files.
  log.info('Found links: %s', links.join('\n'));

  await browser.close();
}
