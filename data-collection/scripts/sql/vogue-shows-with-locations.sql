-- Gets the shows that were originally imported from Vogue with locations, and
-- had the same locations in WWD and thus the records merged as expected.
--
-- This query only returned 3 rows, meaning that I should probably simply omit
-- the location from the show name when merging from WWD (as there were more records
-- that were alike besides the location) and then manually merge those three.
--
-- Hyke FALL 2023 WOMAN RTW TOKYO, Hyke SPRING 2022 WOMAN RTW TOKYO, Hyke SPRING 2023 WOMAN RTW TOKYO
SELECT * FROM (
  SELECT "Show"."name", "Show"."location", COUNT("Review"."id") as "review_count"
  FROM "Show"
  LEFT OUTER JOIN "Review" ON "Review"."showId" = "Show"."id"
  GROUP BY "Show"."name", "Show"."location"
) "Shows" WHERE "review_count" > 1 AND "location" != 'PARIS' AND "location" IS NOT NULL
