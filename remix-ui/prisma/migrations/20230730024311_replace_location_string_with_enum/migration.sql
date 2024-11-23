/*
  Warnings:

  - The `location` column on the `Show` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('NEW_YORK', 'LONDON', 'MILAN', 'PARIS', 'TOKYO', 'BERLIN', 'FLORENCE', 'LOS_ANGELES');

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "location",
ADD COLUMN     "location" "Location";
