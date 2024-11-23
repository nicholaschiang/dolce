SELECT "Show"."name", "Review"."publicationId" FROM "Show"
INNER JOIN "Review" ON "Review"."showId" = "Show"."id"
INNER JOIN "User" on "User"."id" = "Review"."authorId"
WHERE "User"."name" = 'Luisa Zargani'
