"""Scrapy spider for extracting show information from WWD."""

import scrapy


class WWDSpider(scrapy.Spider):
    """Spider for extracting show information from WWD."""

    name = "wwd"
    start_urls = ["https://wwd.com/runway/"]

    # https://wwd.com/runway/
    def parse(self, response):
        """Extract the season links from the seasons list."""
        season_select = response.css(".runway-navigation--selects select")[0]
        season_page_links = season_select.css("option::attr(data-select-url)")
        yield from response.follow_all(season_page_links, self.parse_season)

    # https://wwd.com/runway/fall-couture-2023/
    def parse_season(self, response):
        """Extract the show links from the main shows list."""
        cards = response.css(".latest-runway-loop .o-card-list__item")
        show_page_links = cards.css("a.a-review-badge-after")
        yield from response.follow_all(show_page_links, self.parse_show)
        gallery_page_links = cards.css("a:not(.a-review-badge-after)")
        yield from response.follow_all(gallery_page_links, self.parse_gallery)
        next_page_link = response.css("#page-arrow-next a::attr(href)").get()
        if next_page_link is not None:
            yield response.follow(next_page_link, self.parse_season)

    # https://wwd.com/runway/fall-couture-2023/paris/aelis/review/
    def parse_show(self, response):
        """Extract the show metadata from the show page."""
        gallery_page_link = response.css(".runway-featured-gallery a::attr(href)").get()
        if gallery_page_link is not None:
            yield response.follow(
                gallery_page_link,
                self.parse_gallery,
                cb_kwargs={"show_url": response.url},
            )
        tags = response.css(".article-tags a")
        tags = [
            {"name": tag.css("::text").get(), "url": tag.css("::attr(href)").get()}
            for tag in tags
        ]
        author = response.css(".author button div:first-child a.c-link")
        yield {
            "@type": "Show",
            "url": response.url,
            "title": response.css("title::text").get(),
            "header": response.css(".article-title::text").get(),
            "excerpt": response.css(".article-excerpt::text").get(),
            "content": response.css("#article-content p").getall(),
            "season": response.css(".breadcrumbs li:last-child a::text").get(),
            "author_name": author.css("::text").get(),
            "author_url": response.urljoin(author.css("::attr(href)").get()),
            "date": response.css(".article-timestamp time::text").get(),
            "tags": tags,
        }

    # https://wwd.com/fashion-news/shows-reviews/gallery/aelis-couture-fall-1235727705/
    def parse_gallery(self, response, show_url=None):
        """Extract the look data from the show gallery page."""
        collection = response.css("#pmc-gallery-runway")
        for index, item in enumerate(collection.css("figure")):
            yield {
                "@type": "Look",
                "show_url": show_url,
                "url": response.url,
                "number": index + 1,
                "src": item.css("img::attr(src)").get(),
                "srcset": item.css("img::attr(srcset)").get(),
            }
