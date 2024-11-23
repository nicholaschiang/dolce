/*
  Warnings:

  - You are about to drop the `_ColorToPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ColorToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ColorToPrice" DROP CONSTRAINT "_ColorToPrice_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToPrice" DROP CONSTRAINT "_ColorToPrice_B_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_B_fkey";

-- DropTable
DROP TABLE "_ColorToPrice";

-- DropTable
DROP TABLE "_ColorToProduct";

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColorToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PriceToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Variant_name_productId_key" ON "Variant"("name", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToVariant_AB_unique" ON "_ColorToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToVariant_B_index" ON "_ColorToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToVariant_AB_unique" ON "_PriceToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToVariant_B_index" ON "_PriceToVariant"("B");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToVariant" ADD CONSTRAINT "_ColorToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToVariant" ADD CONSTRAINT "_ColorToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
