/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,seasonId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,sex,styleId,brandId,countryId]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sex` to the `Size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `styleId` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MAN', 'WOMAN', 'UNISEX');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_categoryId_fkey";

-- DropIndex
DROP INDEX "Product_name_categoryId_seasonId_key";

-- DropIndex
DROP INDEX "Size_name_categoryId_brandId_countryId_key";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "categoryId",
ADD COLUMN     "styleId" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "categoryId",
ADD COLUMN     "sex" "Sex" NOT NULL,
ADD COLUMN     "styleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Style" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentStyleId" INTEGER,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToStyle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToStyle_AB_unique" ON "_ProductToStyle"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToStyle_B_index" ON "_ProductToStyle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_seasonId_key" ON "Product"("name", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Size_name_sex_styleId_brandId_countryId_key" ON "Size"("name", "sex", "styleId", "brandId", "countryId");

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_parentStyleId_fkey" FOREIGN KEY ("parentStyleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStyle" ADD CONSTRAINT "_ProductToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToStyle" ADD CONSTRAINT "_ProductToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;
