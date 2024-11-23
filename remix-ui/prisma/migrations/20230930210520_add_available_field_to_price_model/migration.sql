/*
  Warnings:

  - You are about to drop the `_PriceToVariant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[variantId,value,url]` on the table `Price` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `variantId` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PriceToVariant" DROP CONSTRAINT "_PriceToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_PriceToVariant" DROP CONSTRAINT "_PriceToVariant_B_fkey";

-- DropIndex
DROP INDEX "Price_value_url_key";

-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PriceToVariant";

-- CreateIndex
CREATE UNIQUE INDEX "Price_variantId_value_url_key" ON "Price"("variantId", "value", "url");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
