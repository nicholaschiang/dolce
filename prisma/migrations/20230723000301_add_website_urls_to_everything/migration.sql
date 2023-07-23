/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Retailer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Retailer" ADD COLUMN     "url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_url_key" ON "Brand"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Company_url_key" ON "Company"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Retailer_url_key" ON "Retailer"("url");
