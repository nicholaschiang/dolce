/*
  Warnings:

  - A unique constraint covering the columns `[avatar]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar]` on the table `Publication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar]` on the table `Retailer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Publication" ALTER COLUMN "avatar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Retailer" ADD COLUMN     "avatar" TEXT;

-- AlterTable (replace empty strings with null)
UPDATE "Publication" SET "avatar" = NULL WHERE "avatar" = '';

-- CreateIndex
CREATE UNIQUE INDEX "Brand_avatar_key" ON "Brand"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "Company_avatar_key" ON "Company"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_avatar_key" ON "Publication"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "Retailer_avatar_key" ON "Retailer"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_key" ON "User"("avatar");
