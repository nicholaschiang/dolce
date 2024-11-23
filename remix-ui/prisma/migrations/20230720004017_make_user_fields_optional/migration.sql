/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_url_key" ON "Review"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_url_key" ON "User"("url");
