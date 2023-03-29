from pathlib import Path

import re
import json
import scrapy

categories = [
    "tshirts",
    "sweaters",
    "blouses",
    "bodysuits",
    "sweatsuit-sets",
    "coats-jackets",
    "dresses",
    "pants",
    "jeans",
    "leggings-and-bike-shorts",
    "skirts",
    "shorts",
    "jumpsuits-rompers",
    "accessories",
    "swimsuits",
    "shoes",
    "knitwear",
    "contour-clothing",
    "suits-for-women",
]
query = "?lastViewed=1000000000"
link_sel = ".ar-visual-swiper .ar-swiper-item a[data-cat-id]"


def get_largest_img(srcset):
    urls_and_sizes = re.sub(",", "", srcset).split()
    sizes = [
        int(match.group(1))
        for match in (re.search(r"(\d+)w$", size) for size in urls_and_sizes)
        if match
    ]
    sizes.sort(reverse=True)
    return urls_and_sizes[urls_and_sizes.index(f"{sizes[0]}w") - 1]


class AritziaSpider(scrapy.Spider):
    name = "aritzia"
    start_urls = [
        f"https://www.aritzia.com/us/en/clothing/{category}{query}"
        for category in categories
    ]

    def parse_products(self, response, category):
        url = re.sub(f"\{query}", "", response.url)
        link = response.css(f"{link_sel}[href='{url}']")
        if not link:
            style = {
                "name": None,
                "catid": None,
                "url": url,
                "category": category,
            }
            self.logger.warn(f"MISSING LINK FOR CATEGORY: {category}")
            self.logger.warn(f"response.url: {response.url}")
            self.logger.warn(f"url: {url}")
            self.logger.warn(f"sel: {link_sel}[href='{url}']")
            self.logger.warn(f"link: {link}")
            self.logger.warn(f"style: {style}")
        else:
            style = {
                "name": link.css("span.ws-normal::text").get(),
                "catid": link.attrib["data-cat-id"],
                "url": link.attrib["href"],
                "category": category,
            }
        for product in response.css(".ar-product-grid .product-tile"):
            img = product.css(".product-image img")
            image = {
                "alt": img.attrib["alt"],
                "title": img.attrib["title"],
                "mouseover": img.attrib["data-mouseover-img"],
                "mouseout": img.attrib["data-mouseout-img"],
                "original": img.attrib["data-original"],
                "srcset": img.attrib["data-srcset"],
                "srcset_mouseover": img.attrib["data-srcset-mouseover"],
                "sizes": img.attrib["sizes"],
                "largest": get_largest_img(img.attrib["data-srcset"]),
            }
            yield {
                "image": image,
                "style": style,
                "uuid": product.attrib["data-uuid"],
                "itemid": product.attrib["data-itemid"],
                "mpid": product.attrib["data-mpid"],
                "color": product.attrib["data-color"],
                "pkey": product.attrib["data-pkey"],
                "colors": product.attrib["data-colors"],
                "master": json.loads(product.attrib["data-master"] or "{}"),
                "variant": json.loads(product.attrib["data-variant"] or "{}"),
                "vg": product.attrib["data-vg"],
                "campaignimg": product.attrib["data-campaignimg"],
            }

    def parse(self, response):
        category = re.sub(f"\{query}", "", response.url.split("/")[-1])
        links = response.css(f"{link_sel}::attr(href)").getall()
        yield from response.follow_all(
            [f"{link}{query}" for link in links],
            callback=self.parse_products,
            cb_kwargs={"category": category},
        )
        yield from self.parse_products(response, category)
