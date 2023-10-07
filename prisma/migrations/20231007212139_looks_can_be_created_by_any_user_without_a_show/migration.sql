/*
  Warnings:

  - A unique constraint covering the columns `[showId,number]` on the table `Look` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,number]` on the table `Look` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Look_number_showId_key";

-- AlterTable
ALTER TABLE "Look" ADD COLUMN     "authorId" INTEGER,
ALTER COLUMN "showId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Look_showId_number_key" ON "Look"("showId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Look_authorId_number_key" ON "Look"("authorId", "number");

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
