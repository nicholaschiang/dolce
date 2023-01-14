import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export async function getBrandsFromNeimanMarcus(
  neimanMarcusDesignersUrl = 'https://www.neimanmarcus.com/c/designers-cat000730'
): Promise<{ name: string; url: string | undefined }[]> {
  const res = await fetch(neimanMarcusDesignersUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  const brands = $('div.designer-link');
  return [...brands].map((brand) => {
    const name = $(brand).find('a').text();
    const url = $(brand).find('a').attr('href');
    return { name, url };
  });
}
