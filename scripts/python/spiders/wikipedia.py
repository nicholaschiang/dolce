"""Scrapy spider for extracting designer information from Wikipedia."""

import scrapy


class WikipediaSpider(scrapy.Spider):
    """Spider for extracting designer information from Wikipedia."""

    name = "wikipedia"
    start_urls = ["https://en.wikipedia.org/wiki/List_of_fashion_designers"]

    # https://en.wikipedia.org/wiki/List_of_fashion_designers
    def parse(self, response):
        """Extract the designer links from the designers list."""
        content = response.css("#mw-content-text")
        countries = content.css("h2")
        for country in countries:
            country_name = country.css("span.mw-headline::text").get()
            country_id = country.css("span.mw-headline::attr(id)").get()
            # Skip the "See also" section.
            if country_name == "See also":
                continue
            # Get all of the <ul> or <div class='div-col'> elements that are
            # listed underneath this country header.
            # @see {@link https://stackoverflow.com/a/43647765}
            designer_lists = content.xpath(
                "//*[self::ul or self::div][preceding-sibling::h2[1][./span[@id='"
                + country_id
                + "']]]"
            )
            designer_links = designer_lists.css("li a")
            for designer_link in designer_links:
                yield response.follow(
                    designer_link,
                    callback=self.parse_designer,
                    cb_kwargs={
                        "designer_name": designer_link.css("::text").get(),
                        "country_name": country_name,
                        "country_id": country_id,
                    },
                )

    # https://en.wikipedia.org/wiki/Coco_Brandolini_d%27Adda
    def parse_designer(self, response, designer_name, country_name, country_id):
        """Extract the designer info from their Wikipedia page."""
        yield {
            "url": response.url,
            "designer_name": designer_name,
            "country_name": country_name,
            "country_id": country_id,
            "title": response.xpath("//h1//text()").get(),
            "content": response.css("#mw-content-text .mw-parser-output").get(),
            "last_edited": response.css("#footer-info-lastmod::text").get(),
        }
