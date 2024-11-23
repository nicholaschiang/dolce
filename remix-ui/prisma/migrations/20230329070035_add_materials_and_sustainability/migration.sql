/*
  Warnings:

  - You are about to drop the column `productId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `parentStyleId` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `_PriceToVariant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `variantId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sustainability" AS ENUM ('RECYCLED', 'ORGANIC', 'RESPONSIBLE_DOWN', 'RESPONSIBLE_FORESTRY', 'RESPONSIBLE_WOOL', 'RESPONSIBLE_CASHMERE');

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_productId_fkey";

-- DropForeignKey
ALTER TABLE "Style" DROP CONSTRAINT "Style_parentStyleId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_productId_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToVariant" DROP CONSTRAINT "_PriceToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToVariant" DROP CONSTRAINT "_PriceToVariant_B_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Style" DROP COLUMN "parentStyleId",
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "styleGroupId" INTEGER;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PriceToVariant";

-- CreateTable
CREATE TABLE "StyleGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StyleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sustainability" "Sustainability",
    "parentId" INTEGER,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StyleGroup_name_key" ON "StyleGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToVariant_AB_unique" ON "_MaterialToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToVariant_B_index" ON "_MaterialToVariant"("B");

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_styleGroupId_fkey" FOREIGN KEY ("styleGroupId") REFERENCES "StyleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToVariant" ADD CONSTRAINT "_MaterialToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToVariant" ADD CONSTRAINT "_MaterialToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
