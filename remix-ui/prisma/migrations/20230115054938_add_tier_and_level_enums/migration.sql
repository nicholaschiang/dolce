/*
  Warnings:

  - You are about to drop the column `seasonId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToShow` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tier` on the `Brand` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('BESPOKE', 'SUPERPREMIUM', 'PREMIUM_CORE', 'ACCESSIBLE_CORE', 'AFFORDABLE_LUXURY', 'DIFFUSION', 'HIGH_STREET', 'MID_STREET', 'VALUE_MARKET');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BESPOKE', 'COUTURE', 'HANDMADE', 'RTW');

-- CreateEnum
CREATE TYPE "SeasonName" AS ENUM ('SPRING', 'SPRING_SUMMER', 'SUMMER', 'FALL_WINTER', 'FALL', 'WINTER');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToShow" DROP CONSTRAINT "_ProductToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToShow" DROP CONSTRAINT "_ProductToShow_B_fkey";

-- DropIndex
DROP INDEX "Product_name_seasonId_key";

-- DropIndex
DROP INDEX "Show_name_seasonId_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "tier",
ADD COLUMN     "tier" "Tier" NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "seasonId" INTEGER,
ADD COLUMN     "showId" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "seasonId",
DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "name",
ADD COLUMN     "name" "SeasonName" NOT NULL;

-- DropTable
DROP TABLE "_ProductToShow";

-- CreateIndex
CREATE UNIQUE INDEX "Season_name_year_key" ON "Season"("name", "year");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
