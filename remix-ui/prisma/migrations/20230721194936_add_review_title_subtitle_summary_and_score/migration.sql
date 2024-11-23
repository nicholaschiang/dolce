-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "score" DECIMAL(65,30),
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
