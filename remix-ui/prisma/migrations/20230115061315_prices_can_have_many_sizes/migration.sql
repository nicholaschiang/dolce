/*
  Warnings:

  - You are about to drop the column `sizeId` on the `Price` table. All the data in the column will be lost.
  - Made the column `url` on table `Price` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_sizeId_fkey";

-- DropIndex
DROP INDEX "Price_retailerId_brandId_productId_sizeId_key";

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "sizeId",
ALTER COLUMN "url" SET NOT NULL;

-- CreateTable
CREATE TABLE "_PriceToSize" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToSize_AB_unique" ON "_PriceToSize"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToSize_B_index" ON "_PriceToSize"("B");

-- AddForeignKey
ALTER TABLE "_PriceToSize" ADD CONSTRAINT "_PriceToSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToSize" ADD CONSTRAINT "_PriceToSize_B_fkey" FOREIGN KEY ("B") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
