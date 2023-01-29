/*
  Warnings:

  - A unique constraint covering the columns `[value,url]` on the table `Price` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryId` to the `Designer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Designer" ADD COLUMN     "countryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "msrp" DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "Price_value_url_key" ON "Price"("value", "url");

-- AddForeignKey
ALTER TABLE "Designer" ADD CONSTRAINT "Designer_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
