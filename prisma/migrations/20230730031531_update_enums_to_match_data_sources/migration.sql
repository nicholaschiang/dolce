/*
  Warnings:

  - The values [SPRING_SUMMER,SUMMER,FALL_WINTER,WINTER] on the enum `SeasonName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Location" ADD VALUE 'MADRID';
ALTER TYPE "Location" ADD VALUE 'COPENHAGEN';
ALTER TYPE "Location" ADD VALUE 'SHANGAI';
ALTER TYPE "Location" ADD VALUE 'AUSTRALIA';
ALTER TYPE "Location" ADD VALUE 'STOCKHOLM';
ALTER TYPE "Location" ADD VALUE 'MEXICO';
ALTER TYPE "Location" ADD VALUE 'MEXICO_CITY';
ALTER TYPE "Location" ADD VALUE 'KIEV';
ALTER TYPE "Location" ADD VALUE 'TBILISI';
ALTER TYPE "Location" ADD VALUE 'SEOUL';
ALTER TYPE "Location" ADD VALUE 'RUSSIA';
ALTER TYPE "Location" ADD VALUE 'UKRAINE';
ALTER TYPE "Location" ADD VALUE 'SAO_PAOLO';
ALTER TYPE "Location" ADD VALUE 'BRIDAL';

-- AlterEnum
BEGIN;
CREATE TYPE "SeasonName_new" AS ENUM ('RESORT', 'SPRING', 'PRE_FALL', 'FALL');
ALTER TABLE "Season" ALTER COLUMN "name" TYPE "SeasonName_new" USING ("name"::text::"SeasonName_new");
ALTER TYPE "SeasonName" RENAME TO "SeasonName_old";
ALTER TYPE "SeasonName_new" RENAME TO "SeasonName";
DROP TYPE "SeasonName_old";
COMMIT;
