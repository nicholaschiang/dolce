/*
  Warnings:

  - You are about to drop the column `code` on the `Country` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Country_code_key";

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "code";
