/*
  Warnings:

  - You are about to drop the `_ShowToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ShowToUser" DROP CONSTRAINT "_ShowToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShowToUser" DROP CONSTRAINT "_ShowToUser_B_fkey";

-- AlterTable
ALTER TABLE "Retailer" ADD COLUMN     "companyId" INTEGER;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ShowToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Show_url_key" ON "Show"("url");

-- AddForeignKey
ALTER TABLE "Retailer" ADD CONSTRAINT "Retailer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
