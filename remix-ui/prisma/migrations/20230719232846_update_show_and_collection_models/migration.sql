/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the `Designer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionToDesigner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DesignerToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DesignerToShow` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[videoId]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consumerReviewSummary` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criticReviewSummary` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Designer" DROP CONSTRAINT "Designer_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Designer" DROP CONSTRAINT "Designer_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToDesigner" DROP CONSTRAINT "_CollectionToDesigner_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToDesigner" DROP CONSTRAINT "_CollectionToDesigner_B_fkey";

-- DropForeignKey
ALTER TABLE "_DesignerToProduct" DROP CONSTRAINT "_DesignerToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_DesignerToProduct" DROP CONSTRAINT "_DesignerToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_DesignerToShow" DROP CONSTRAINT "_DesignerToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_DesignerToShow" DROP CONSTRAINT "_DesignerToShow_B_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "variantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "endedAt",
DROP COLUMN "startedAt",
DROP COLUMN "venue",
ADD COLUMN     "consumerReviewSummary" TEXT NOT NULL,
ADD COLUMN     "criticReviewSummary" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "videoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "variantId" DROP NOT NULL;

-- DropTable
DROP TABLE "Designer";

-- DropTable
DROP TABLE "_CollectionToDesigner";

-- DropTable
DROP TABLE "_DesignerToProduct";

-- DropTable
DROP TABLE "_DesignerToShow";

-- CreateTable
CREATE TABLE "Look" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "modelId" INTEGER,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "Look_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "publicationId" INTEGER,
    "url" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LookToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ShowToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Look_imageId_key" ON "Look"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Look_number_showId_key" ON "Look"("number", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_name_key" ON "Publication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToUser_AB_unique" ON "_ProductToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToUser_B_index" ON "_ProductToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToUser_AB_unique" ON "_CollectionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToUser_B_index" ON "_CollectionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LookToProduct_AB_unique" ON "_LookToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_LookToProduct_B_index" ON "_LookToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShowToUser_AB_unique" ON "_ShowToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShowToUser_B_index" ON "_ShowToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Show_name_key" ON "Show"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Show_videoId_key" ON "Show"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToUser" ADD CONSTRAINT "_ProductToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToUser" ADD CONSTRAINT "_CollectionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToProduct" ADD CONSTRAINT "_LookToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Look"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToProduct" ADD CONSTRAINT "_LookToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowToUser" ADD CONSTRAINT "_ShowToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowToUser" ADD CONSTRAINT "_ShowToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
