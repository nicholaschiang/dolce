/*
  Warnings:

  - You are about to drop the column `date` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `publicationId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `consumerReviewSummary` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `criticReviewSummary` on the `Show` table. All the data in the column will be lost.
  - Made the column `score` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_publicationId_fkey";

-- DropIndex
DROP INDEX "Review_url_key";

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "writtenAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "score" DECIMAL(65,30),
    "authorId" INTEGER,
    "userId" INTEGER,
    "showId" INTEGER,
    "publicationId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- AlterTable (move all critic reviews to articles)
WITH "CriticReview" AS (
  DELETE FROM "Review"
  WHERE "publicationId" IS NOT NULL
  RETURNING
    "createdAt",
    "updatedAt",
    "date",
    "url",
    "title",
    "subtitle",
    "summary",
    "content",
    "score",
    "authorId",
    "showId",
    "publicationId"
)
INSERT INTO "Article" (
  "createdAt",
  "updatedAt",
  "writtenAt",
  "url",
  "title",
  "subtitle",
  "summary",
  "content",
  "score",
  "authorId",
  "showId",
  "publicationId"
)
SELECT DISTINCT * FROM "CriticReview";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "date",
DROP COLUMN "publicationId",
DROP COLUMN "subtitle",
DROP COLUMN "summary",
DROP COLUMN "title",
DROP COLUMN "url",
ALTER COLUMN "score" SET NOT NULL;

-- AlterTable (rename summary columns)
ALTER TABLE "Show" RENAME COLUMN "consumerReviewSummary" TO "reviewsConsensus";
ALTER TABLE "Show" RENAME COLUMN "criticReviewSummary" TO "articlesConsensus";

-- CreateIndex
CREATE UNIQUE INDEX "Article_url_key" ON "Article"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Article_authorId_showId_key" ON "Article"("authorId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_publicationId_title_key" ON "Article"("publicationId", "title");

-- CreateIndex (skipped for now: https://linear.app/nicholaschiang/issue/NC-747)
-- CREATE UNIQUE INDEX "Article_publicationId_userId_key" ON "Article"("publicationId", "userId");

-- CreateIndex (skipped for now: https://linear.app/nicholaschiang/issue/NC-747)
-- CREATE UNIQUE INDEX "Article_publicationId_showId_key" ON "Article"("publicationId", "showId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
