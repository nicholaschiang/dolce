/*
  Warnings:

  - A unique constraint covering the columns `[brandId,seasonId,sex,level,location]` on the table `Show` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Show_brandId_seasonId_sex_level_key";

-- CreateIndex
CREATE UNIQUE INDEX "Show_brandId_seasonId_sex_level_location_key" ON "Show"("brandId", "seasonId", "sex", "level", "location");
