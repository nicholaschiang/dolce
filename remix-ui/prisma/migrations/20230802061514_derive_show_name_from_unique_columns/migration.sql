-- Derive the show name from the other unique show columns. The name column is
-- really redundant and is only used for convenience when importing shows.
UPDATE "Show"
SET "name" = TRIM(CONCAT(
    "Brand"."name", ' ', "Season"."name", ' ', "Season"."year", ' ',
    "Show"."sex", ' ', "Show"."level", ' ', "Show"."location"
))
FROM "Brand", "Season"
WHERE "Show"."seasonId" = "Season"."id"
	AND "Show"."brandId" = "Brand"."id";
