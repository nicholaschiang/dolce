-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "consumerReviewScore" DECIMAL(65,30),
ADD COLUMN     "criticReviewScore" DECIMAL(65,30),
ALTER COLUMN "consumerReviewSummary" DROP NOT NULL,
ALTER COLUMN "criticReviewSummary" DROP NOT NULL;
