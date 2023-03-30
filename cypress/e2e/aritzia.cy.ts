/* eslint-disable promise/catch-or-return, promise/always-return */

// Aritzia has a ton of sub-brands that are all owned by Aritizia LP. My db
// schema is set up to handle this well. To get products on Aritzia, simply:
// await prisma.product.findMany({
//   include: { images: true },
//   where: {
//     brands: { some: { company: { name: { equals: 'Aritzia' } } } },
//     prices: { some: { brand: { name: { equals: 'Aritzia' } } } },
//   },
// })

// The scraping plan:
// 1. Manually construct list of product parent Styles (links in the header).
// 2. For each product parent Style, open a new window in parallel.
// 3. Each one of those product parent Styles has a list of children Styles at
//    the top of the page. Some product pages have additional style-specific
//    attributes (e.g. "neckline") that will be added as a StyleGroup.
// 4. Record all the products that appear in the product parent Style page.
// 5. Apply each possible filter sequentially to the child Style list. Record
//    which products appear in which filters.
// 6. For each product, open the product window in parallel to record:
//    - colors
//    - sizes
//    - prices
//    - description
//    - images
//    - materials
//    - reviews

import type { Product, Style, StyleGroup } from '@prisma/client'
import invariant from 'tiny-invariant'

type DataMaster = {
  name: string
  brand: string
  master: string
  category: string
  size: string
  color: string
  department: string
  price: string
  listprice: string
  currency: string
  issale: string
  genbuycode: string
  varbuycode: string
  model: string
  availability: string
  label: string
  climaterating: number
  specialorderdate: string
}
type DataVariant = {
  color: { id: string; name: string }
  model: { id: string }
}
type DataImage = {
  alt: string
  title: string
  mouseover: string
  mouseout: string
  original: string
  srcset_mouseover: string
  srcset: string
  sizes: string
  largest: string
}
type DataStyle = Style & { url: string; catid: string }
type DataProduct = {
  uuid: string
  itemid: string
  mpid: string
  color: string
  pkey: string
  colors: string
  master: DataMaster
  variant: DataVariant
  vg: string
  campaignimg: string
  styles: DataStyle[]
  elements: JQuery<HTMLElement>[]
  image: DataImage
}

let styleId = 1
const products: DataProduct[] = []

function getLargestImageURL(srcset: string): string {
  const urls = srcset.replace(/\s+[0-9]+(\.[0-9]+)?[wx]/g, '').split(/,/)
  const large = urls.find((url) => url.includes('/large/'))
  invariant(large, `No large image found in srcset: ${srcset}`)
  return large
}

function scrape(style: DataStyle) {
  // 2. For each product parent Style, open a new window in parallel.
  cy.visit(`${style.url}?lastViewed=1000000000`)
  cy.get('.ar-visual-swiper__link.active').then((active) => {
    console.log('active', active)
    expect(active.attr('href')).to.equal(style.url)
    expect(active.attr('data-cat-id')).to.equal(style.catid)
  })
  // 3. Record all the products that appear in the product parent Style page.
  cy.get('.ar-product-grid .product-tile').each((el) => {
    cy.wrap(el)
      .find('.product-image img')
      .should('exist')
      .then((img) => {
        const image: DataImage = {
          alt: (img.attr('alt') as string).trim(),
          title: (img.attr('title') as string).trim(),
          mouseover: (img.attr('data-mouseover-img') as string).trim(),
          mouseout: (img.attr('data-mouseout-img') as string).trim(),
          original: (img.attr('data-original') as string).trim(),
          srcset: (img.attr('data-srcset') as string).trim(),
          srcset_mouseover: (
            img.attr('data-srcset-mouseover') as string
          ).trim(),
          sizes: (img.attr('sizes') as string).trim(),
          largest: getLargestImageURL(img.attr('data-srcset') as string),
        }
        const product: DataProduct = {
          image,
          styles: [style],
          elements: [el],
          uuid: (el.attr('data-uuid') as string).trim(),
          itemid: (el.attr('data-itemid') as string).trim(),
          mpid: (el.attr('data-mpid') as string).trim(),
          color: (el.attr('data-color') as string).trim(),
          pkey: (el.attr('data-pkey') as string).trim(),
          colors: (el.attr('data-colors') as string).trim(),
          master: JSON.parse(el.attr('data-master') ?? '{}') as DataMaster,
          variant: JSON.parse(el.attr('data-variant') ?? '{}') as DataVariant,
          vg: (el.attr('data-vg') as string).trim(),
          campaignimg: (el.attr('data-campaignimg') as string).trim(),
        }
        if (products.find((p) => p.uuid === product.uuid))
          console.warn('duplicate product', product.uuid)
        console.log('product', product)
        products.push(product)
      })
  })
  // TODO add a check that the number of products scraped matches the number
  // shown by Aritzia; this seems to be buggy as there is a seemingly
  // inconsistent mismatch between the count shown by Aritzia and the actual
  // number of products shown on the page. While this may be due to
  // duplicate products being shown, filtering out duplicates (e.g. products
  // that have the same pkey or name) still does not match Aritzia's count.
  cy.get('.ar-search-refined__count').then((count) => {
    console.log('products.length', products.length)
    const productsCount = products.filter((p) =>
      p.styles.some((s) => s.id === style.id),
    ).length
    const totalCount = Number(count.first().text())
    expect(productsCount).to.be.at.least(totalCount)
  })
}

describe('aritzia', () => {
  it('lets me scrape product data', () => {
    // 1. Manually construct list of product parent Styles (links in the header)
    // and specify duplicate child Styles (e.g. the "sweatshirts" child Style
    // shows up in both the sweaters and the sweatsuits pages but will always
    // redirect to the child Style in the sweatsuits page and thus I ignore it
    // when on the sweaters page).
    Object.entries({
      'tshirts': {},
      'sweaters': {
        // TODO instead of simply ignoring styles that appear in multiple parent
        // style pages, I should record that they have multiple parent styles.
        ignore: ['sweatshirts', 'dresses-sweaters'],
      },
      'blouses': {},
      'bodysuits': {},
      'sweatsuit-sets': {},
      'coats-jackets': {},
      'dresses': {},
      'pants': {},
      'jeans': {},
      'leggings-and-bike-shorts': {},
      'skirts': {},
      'shorts': {},
      'jumpsuits-rompers': {},
      'accessories': {},
      'swimsuits': {},
      'shoes': {},
      'knitwear': {},
      'contour-clothing': {},
      'suits-for-women': {},
    }).forEach(([category, { ignore }]) => {
      const style: DataStyle = {
        id: styleId,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        styleGroupId: null,
        parentId: null,
        catid: category,
        url: `https://www.aritzia.com/us/en/clothing/${category}`,
      }
      styleId += 1
      scrape(style)
      // 4. Each one of those product parent Styles has a list of children Styles at
      //    the top of the page. Some product pages have additional style-specific
      //    attributes (e.g. "neckline") that will be added as a StyleGroup.
      cy.get('.ar-visual-swiper.mv3 .ar-swiper-item a:not(.active)').each(
        (el) => {
          if (ignore?.includes(el.attr('data-cat-id') as string)) {
            console.warn('ignoring style', el.attr('data-cat-id'))
          } else {
            const child: DataStyle = {
              id: styleId,
              name: el.text().trim(),
              catid: el.attr('data-cat-id') as string,
              styleGroupId: null,
              parentId: style.id,
              url: el.attr('href') as string,
            }
            expect(child.url).to.equal(`${style.url}/${child.catid}`)
            styleId += 1
            console.log('child', child)
            scrape(child)
          }
        },
      )
      // 5. Apply each possible filter sequentially to the child Style list.
      //    Record which products appear in which filters.
      // 6. For each product, open the product window in parallel to record:
    })
  })
})

Cypress.on('uncaught:exception', (error) => {
  console.warn(error)
  return false
})
