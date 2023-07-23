/*
  Warnings:

  - You are about to drop the column `consumerReviewScore` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `criticReviewScore` on the `Show` table. All the data in the column will be lost.
  - Made the column `score` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "score" SET NOT NULL;

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "consumerReviewScore",
DROP COLUMN "criticReviewScore";
