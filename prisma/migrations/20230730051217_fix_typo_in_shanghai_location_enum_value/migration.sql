/*
  Warnings:

  - The values [SHANGAI] on the enum `Location` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Location_new" AS ENUM ('NEW_YORK', 'LONDON', 'MILAN', 'PARIS', 'TOKYO', 'BERLIN', 'FLORENCE', 'LOS_ANGELES', 'MADRID', 'COPENHAGEN', 'SHANGHAI', 'AUSTRALIA', 'STOCKHOLM', 'MEXICO', 'MEXICO_CITY', 'KIEV', 'TBILISI', 'SEOUL', 'RUSSIA', 'UKRAINE', 'SAO_PAOLO', 'BRIDAL');
ALTER TABLE "Show" ALTER COLUMN "location" TYPE "Location_new" USING ("location"::text::"Location_new");
ALTER TYPE "Location" RENAME TO "Location_old";
ALTER TYPE "Location_new" RENAME TO "Location";
DROP TYPE "Location_old";
COMMIT;
