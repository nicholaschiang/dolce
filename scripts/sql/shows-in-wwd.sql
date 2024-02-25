SELECT "Show"."name" FROM "Review" INNER JOIN "Show" ON "Show"."id" = "Review"."showId" WHERE "Review"."publicationId" = 2 ORDER BY "Show"."name" ASC
