-- Looks with more than one image.
SELECT "Look"."id", COUNT("Image"."id") as "images_count"
FROM "Look" JOIN "Image" ON "Image"."lookId" = "Look"."id"
GROUP BY "Look"."id"
HAVING COUNT("Image"."id") > 1;
