/*
  Warnings:

  - You are about to drop the `_ProductToSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToSet" DROP CONSTRAINT "_ProductToSet_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSet" DROP CONSTRAINT "_ProductToSet_B_fkey";

-- DropTable
DROP TABLE "_ProductToSet";

-- CreateTable
CREATE TABLE "_SetToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SetToVariant_AB_unique" ON "_SetToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_SetToVariant_B_index" ON "_SetToVariant"("B");

-- AddForeignKey
ALTER TABLE "_SetToVariant" ADD CONSTRAINT "_SetToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetToVariant" ADD CONSTRAINT "_SetToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
