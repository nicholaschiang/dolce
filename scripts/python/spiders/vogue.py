"""Scrapy spider for extracting show information from Vogue."""

import scrapy


# This works fine for extracting basic show metadata but, as far as I know,
# cannot be used to extract the look images as Vogue only loads the first nine
# and the remainder must be loaded via JS by clicking "show more".
class VogueSpider(scrapy.Spider):
    """Spider for extracting show information from Vogue."""

    name = "vogue"
    start_urls = [
        "https://www.vogue.com/fashion-shows/spring-2024-ready-to-wear",
        "https://www.vogue.com/fashion-shows/spring-2024-menswear",
        "https://www.vogue.com/fashion-shows/fall-2023-ready-to-wear",
        "https://www.vogue.com/fashion-shows/fall-2023-menswear",
        "https://www.vogue.com/fashion-shows/spring-2023-ready-to-wear",
        "https://www.vogue.com/fashion-shows/spring-2023-menswear",
        "https://www.vogue.com/fashion-shows/resort-2023",
        "https://www.vogue.com/fashion-shows/resort-2023-menswear",
    ]

    def parse(self, response):
        """Extract the show links from the main shows list."""
        show_page_links = response.css(
            "[data-testid=GroupedNavigationWrapper] "
            + "[data-testid=navigation__list-item] "
            + "a[data-testid=navigation__internal-link]"
        )
        yield from response.follow_all(show_page_links, self.parse_show)

    def parse_show(self, response):
        """Extract the show metadata from the show page."""
        content = response.css("[data-testid=BodyWrapper] > div > p").getall()
        header = response.css("[data-testid=ContentHeaderContainer]")
        author = header.css("[data-testid=BylineName] a")
        collection = response.css("[data-testid=RunwayShowGallery]")
        looks = []
        for index, item in enumerate(collection.css(".grid--item")):
            look = {
                "number": index + 1,
                "url": response.urljoin(item.css("a::attr(href)").get()),
                "src": item.css("img::attr(src)").get(),
                "srcset": item.css("img::attr(srcset)").get(),
            }
            looks.append(look)
        yield {
            "url": response.url,
            "title": response.css("title::text").get(),
            "content": content,
            "brand": response.css("[data-testid=SectionHeaderHed] a::text").get(),
            "season": response.css("[data-testid=SectionHeaderSubhed] a::text").get(),
            "author_name": author.css("::text").get(),
            "author_url": response.urljoin(author.css("::attr(href)").get()),
            "author_avatar": header.css(".responsive-image__image::attr(src)").get(),
            "date": header.css("[data-testid=ContentHeaderPublishDate]::text").get(),
            "looks": looks,
        }
