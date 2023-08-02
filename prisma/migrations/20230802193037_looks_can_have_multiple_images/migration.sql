/*
  Warnings:

  - You are about to drop the column `imageId` on the `Look` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number,showId]` on the table `Look` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "lookId" INTEGER;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_lookId_fkey" FOREIGN KEY ("lookId") REFERENCES "Look"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable (migrate the one-to-one image relation to the new one-to-many relation)
UPDATE "Image" SET "lookId" = "Look"."id" FROM "Look" WHERE "Image"."id" = "Look"."imageId";

-- DropForeignKey
ALTER TABLE "Look" DROP CONSTRAINT "Look_imageId_fkey";

-- DropIndex
DROP INDEX "Look_imageId_key";

-- AlterTable
ALTER TABLE "Look" DROP COLUMN "imageId";

-- AlterTable (combine duplicate looks from the same collection)
UPDATE "Image" SET "lookId" = "DuplicateLook"."idmin" FROM (
  SELECT ARRAY_AGG("id") "id", MIN("id") "idmin"
	FROM "Look"
	GROUP BY "showId", "number"
	HAVING COUNT(*) > 1
 ) AS "DuplicateLook"
WHERE "Image"."lookId" = ANY("DuplicateLook"."id") AND "Image"."lookId" != "DuplicateLook"."idmin";
 
DELETE FROM "Look" USING (
  SELECT ARRAY_AGG("id") "id", MIN("id") "idmin"
	FROM "Look"
	GROUP BY "showId", "number"
	HAVING COUNT(*) > 1
 ) AS "DuplicateLook"
WHERE "Look"."id" = ANY("DuplicateLook"."id") AND "Look"."id" != "DuplicateLook"."idmin";

-- CreateIndex
CREATE UNIQUE INDEX "Look_number_showId_key" ON "Look"("number", "showId");
