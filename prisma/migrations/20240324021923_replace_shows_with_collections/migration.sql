/*
  Warnings:

  - You are about to drop the column `showId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `showId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `showId` on the `Look` table. All the data in the column will be lost.
  - You are about to drop the column `showId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `articlesConsensus` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsConsensus` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the `_BrandToCollection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authorId,collectionId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brandId,seasonId,sex,level,location]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collectionId,number]` on the table `Look` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,collectionId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Made the column `seasonId` on table `Collection` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `collectionId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_showId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_showId_fkey";

-- DropForeignKey
ALTER TABLE "Look" DROP CONSTRAINT "Look_showId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_showId_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToCollection" DROP CONSTRAINT "_BrandToCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToCollection" DROP CONSTRAINT "_BrandToCollection_B_fkey";

-- DropIndex
DROP INDEX "Article_authorId_showId_key";

-- DropIndex
DROP INDEX "Look_showId_number_key";

-- DropIndex
DROP INDEX "Review_authorId_showId_key";

-- DropIndex
DROP INDEX "Show_brandId_seasonId_sex_level_location_key";

-- DropView (used by the remove special characters from brand slug migration)
DROP VIEW IF EXISTS "DuplicateLooks";
DROP VIEW IF EXISTS "DuplicateShows";
DROP VIEW IF EXISTS "DuplicateBrands";

-- AlterTable (remove duplicate collections)
-- https://www.postgresqltutorial.com/postgresql-tutorial/how-to-delete-duplicate-rows-in-postgresql/
DELETE FROM "Collection" WHERE "Collection"."id" IN (
SELECT "id"
    FROM 
        (SELECT "id",
         ROW_NUMBER() OVER( PARTITION BY "showId"
        ORDER BY  "id" ) AS row_num
        FROM "Collection" ) t
        WHERE t.row_num > 1 ORDER BY "id" DESC
  );

-- AlterTable (move articles to collections)
ALTER TABLE "Article" ADD COLUMN "collectionId" INTEGER;
UPDATE "Article" SET "collectionId" = "Collection"."id" FROM "Collection" WHERE "Collection"."showId" = "Article"."showId";
ALTER TABLE "Article" DROP COLUMN "showId";

-- AlterTable (move looks to collections)
ALTER TABLE "Look" ADD COLUMN "collectionId" INTEGER;
UPDATE "Look" SET "collectionId" = "Collection"."id" FROM "Collection" WHERE "Collection"."showId" = "Look"."showId";
ALTER TABLE "Look" DROP COLUMN "showId";

-- AlterTable (move reviews to collections)
ALTER TABLE "Review" ADD COLUMN "collectionId" INTEGER;
UPDATE "Review" SET "collectionId" = "Collection"."id" FROM "Collection" WHERE "Collection"."showId" = "Review"."showId";
ALTER TABLE "Review" ALTER COLUMN "collectionId" SET NOT NULL, DROP COLUMN "showId";

-- AlterTable (move show data to the corresponding collection)
ALTER TABLE "Collection" ADD COLUMN "articlesConsensus" TEXT,
ADD COLUMN "brandId" INTEGER,
ADD COLUMN "date" TIMESTAMP(3),
ADD COLUMN "description" TEXT,
ADD COLUMN "level" "Level",
ADD COLUMN "location" "Location",
ADD COLUMN "reviewsConsensus" TEXT,
ADD COLUMN "sex" "Sex",
ADD COLUMN "url" TEXT;

UPDATE "Collection"
SET
    "articlesConsensus" = "Show"."articlesConsensus",
    "brandId" = "Show"."brandId",
    "date" = "Show"."date",
    "description" = "Show"."description",
    "level" = "Show"."level",
    "location" = "Show"."location",
    "reviewsConsensus" = "Show"."reviewsConsensus",
    "seasonId" = "Show"."seasonId",
    "sex" = "Show"."sex",
    "url" = "Show"."url"
FROM "Show" WHERE "Show"."id" = "Collection"."showId";

ALTER TABLE "Collection" ALTER COLUMN "brandId" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "sex" SET NOT NULL,
ALTER COLUMN "seasonId" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "articlesConsensus",
DROP COLUMN "brandId",
DROP COLUMN "description",
DROP COLUMN "level",
DROP COLUMN "location",
DROP COLUMN "reviewsConsensus",
DROP COLUMN "seasonId",
DROP COLUMN "sex";

-- DropTable
DROP TABLE "_BrandToCollection";

-- CreateTable
CREATE TABLE "_CollectionToShow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);
INSERT INTO "_CollectionToShow"("A", "B") SELECT "Collection"."id", "Collection"."showId" FROM "Collection";
ALTER TABLE "Collection" DROP COLUMN "showId";

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToShow_AB_unique" ON "_CollectionToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToShow_B_index" ON "_CollectionToShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Article_authorId_collectionId_key" ON "Article"("authorId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_url_key" ON "Collection"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_brandId_seasonId_sex_level_location_key" ON "Collection"("brandId", "seasonId", "sex", "level", "location");

-- CreateIndex
CREATE UNIQUE INDEX "Look_collectionId_number_key" ON "Look"("collectionId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Review_authorId_collectionId_key" ON "Review"("authorId", "collectionId");

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToShow" ADD CONSTRAINT "_CollectionToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToShow" ADD CONSTRAINT "_CollectionToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
