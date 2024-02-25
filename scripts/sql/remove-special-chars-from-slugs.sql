CREATE EXTENSION IF NOT EXISTS unaccent;

-- Normalize the brand slugs.
CREATE OR REPLACE TEMP VIEW "BrandWithSlug" AS
SELECT
  REGEXP_REPLACE(NORMALIZE("slug", NFKD), '[\x0300-\x036f]', '', 'g') as "normalized_slug",
  REGEXP_REPLACE(NORMALIZE("slug", NFKD), E'[\\x0300-\\x036f\\x2019\'"]', '', 'g') as "unquoted_normalized_slug",
  UNACCENT("slug") as "unaccent_slug",
  REGEXP_REPLACE(UNACCENT("slug"), E'[\'"]', '') as "unquoted_slug",
  *
FROM "Brand";
SELECT * FROM "BrandWithSlug";

-- See if there are any duplicate brands.
CREATE OR REPLACE TEMP VIEW "DuplicateBrands" AS
SELECT "unquoted_normalized_slug", ARRAY_AGG("BrandWithSlug"."id") AS "id", MAX("id") "idmax"
FROM "BrandWithSlug"
GROUP BY "unquoted_normalized_slug"
HAVING COUNT(*) > 1;
SELECT * FROM "DuplicateBrands";

-- See if there are any duplicate shows.
SELECT * FROM "Show" INNER JOIN "DuplicateBrands" ON "Show"."brandId" = ANY("DuplicateBrands"."id");

-- Combine duplicates. For every show:
-- (a) move all reviews to the last created show (i.e. the larger "ID");
-- (b) add all look images to the last created show;
-- (c) punt on all other relations as they aren't populated yet;
-- (d) delete the duplicate show;
-- (e) delete the duplicate brand.

-- Note this only works given the assumption that the most recently created brand
-- is also associated with the most recently created show, looks, images, etc.
--
-- This assumption is generally correct as I import brands, shows, looks, and images
-- all at the same time. Should this change in the future, this migration will no longer
-- work (but then again, it won't have to because it will have already been applied).

CREATE OR REPLACE TEMP VIEW "DuplicateShows" AS
SELECT ARRAY_AGG("Show"."id") "id", MAX("Show"."id") "idmax", "DuplicateBrands"."idmax" "brandId"
FROM "Show"
INNER JOIN "DuplicateBrands" ON "Show"."brandId" = ANY("DuplicateBrands"."id")
GROUP BY "DuplicateBrands"."idmax", "seasonId", "sex", "level"
HAVING COUNT(*) > 1;
SELECT * FROM "DuplicateShows";

CREATE OR REPLACE TEMP VIEW "DuplicateLooks" AS
SELECT ARRAY_AGG("Look"."id") "id", MAX("Look"."id") "idmax", "DuplicateShows"."idmax" "showId"
FROM "Look"
INNER JOIN "DuplicateShows" ON "Look"."showId" = ANY("DuplicateShows"."id")
GROUP BY "DuplicateShows"."idmax", "Look"."number"
HAVING COUNT(*) > 1;
SELECT * FROM "DuplicateLooks";

-- (a) move all reviews to the last created show (i.e. the larger "ID");
UPDATE "Review" SET "showId" = "DuplicateShows"."idmax" FROM "DuplicateShows"
WHERE "Review"."showId" = ANY("DuplicateShows"."id") AND "Review"."showId" != "DuplicateShows"."idmax";

-- (b) add all look images to the last created show;
UPDATE "Image" SET "lookId" = "DuplicateLooks"."idmax" FROM "DuplicateLooks"
WHERE "Image"."lookId" = ANY("DuplicateLooks"."id") AND "Image"."lookId" != "DuplicateLooks"."idmax";

-- Delete duplicates (i.e. the smaller "ID" as we're keeping the larger "ID").
DELETE FROM "Brand" USING "DuplicateBrands"
WHERE "Brand"."id" = ANY("DuplicateBrands"."id") AND "Brand"."id" != "DuplicateBrands"."idmax";

-- Update the brand slugs (to remove special characters).
UPDATE "Brand" SET "slug" = "unquoted_normalized_slug" FROM "BrandWithSlug" WHERE "BrandWithSlug"."id" = "Brand"."id";
