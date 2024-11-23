from urllib.parse import urlparse, parse_qs

import scrapy
import json

domains = ["kith.com", "aimeleondore.com"]


class ShopifySpider(scrapy.Spider):
    name = "shopify"
    start_urls = [
        f"https://www.{domain}/products.json?page=1&limit=250" for domain in domains
    ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        data = json.loads(response.text)
        yield from data["products"]
        if len(data["products"]) > 0:
            url = urlparse(response.url)
            page = int(parse_qs(url.query)["page"][0])
            next_url = url._replace(query=f"page={page + 1}&limit=250")
            yield response.follow(next_url.geturl())
