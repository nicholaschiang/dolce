/*
  Warnings:

  - You are about to drop the column `sex` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the `_BrandToShow` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brandId,seasonId,sex,level]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "slug" TEXT;

-- AlterTable (set the default brand slugs to their names)
UPDATE "Brand" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '([[:punct:]]|\s)+', '-', 'g'), '-$', ''));

-- AlterTable (ensure that the slug is non-nullable)
ALTER TABLE "Brand" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "brandId" INTEGER;

-- AlterTable (set the show brand to their first existing brand)
UPDATE "Show" SET "brandId" = (SELECT "A" FROM "_BrandToShow" WHERE "B" = "id");

-- AlterTable (ensure that the show brand is non-nullable)
ALTER TABLE "Show" ALTER COLUMN "brandId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "level" "Level";

-- AlterTable (set the level to RTW; all the existing shows are RTW)
UPDATE "Show" SET "level" = 'RTW';

-- AlterTable (ensure that the show level is non-nullable)
ALTER TABLE "Show" ALTER COLUMN "level" SET NOT NULL;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "sex" "Sex";

-- AlterTable (set the show sex based on the collection sex)
UPDATE "Show" SET "sex" = (SELECT "Collection"."sex" FROM "Collection" WHERE "Collection"."showId" = "Show"."id");

-- AlterTable (ensure that the show sex is non-nullable)
ALTER TABLE "Show" ALTER COLUMN "sex" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Show_brandId_seasonId_sex_level_key" ON "Show"("brandId", "seasonId", "sex", "level");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "sex";

-- DropForeignKey
ALTER TABLE "_BrandToShow" DROP CONSTRAINT "_BrandToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToShow" DROP CONSTRAINT "_BrandToShow_B_fkey";

-- DropTable
DROP TABLE "_BrandToShow";
