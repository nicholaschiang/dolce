/*
  Warnings:

  - You are about to drop the column `variantId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `_PriceToSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToSize` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `Variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_variantId_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToSize" DROP CONSTRAINT "_PriceToSize_A_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToSize" DROP CONSTRAINT "_PriceToSize_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_B_fkey";

-- DropIndex
DROP INDEX "Size_name_key";

-- DropIndex
DROP INDEX "Variant_name_productId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "variantId",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "position" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "name",
ADD COLUMN     "sizeId" INTEGER NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "variantId";

-- DropTable
DROP TABLE "_PriceToSize";

-- DropTable
DROP TABLE "_ProductToSize";

-- CreateTable
CREATE TABLE "_VariantToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PriceToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ImageToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VariantToVideo_AB_unique" ON "_VariantToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_VariantToVideo_B_index" ON "_VariantToVideo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToVariant_AB_unique" ON "_PriceToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToVariant_B_index" ON "_PriceToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToVariant_AB_unique" ON "_ImageToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToVariant_B_index" ON "_ImageToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Size_slug_key" ON "Size"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_key" ON "Variant"("sku");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantToVideo" ADD CONSTRAINT "_VariantToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantToVideo" ADD CONSTRAINT "_VariantToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToVariant" ADD CONSTRAINT "_ImageToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToVariant" ADD CONSTRAINT "_ImageToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
