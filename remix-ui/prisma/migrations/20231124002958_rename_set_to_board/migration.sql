/*
  Warnings:

  - You are about to drop the `Set` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LookToSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SetToVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_LookToSet" DROP CONSTRAINT "_LookToSet_A_fkey";

-- DropForeignKey
ALTER TABLE "_LookToSet" DROP CONSTRAINT "_LookToSet_B_fkey";

-- DropForeignKey
ALTER TABLE "_SetToVariant" DROP CONSTRAINT "_SetToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetToVariant" DROP CONSTRAINT "_SetToVariant_B_fkey";

-- DropTable (manually updated to simply rename)
ALTER TABLE "Set" RENAME TO "Board";
ALTER TABLE "Board" RENAME CONSTRAINT "Set_pkey" TO "Board_pkey";

-- DropIndex
DROP INDEX "_LookToSet_AB_unique";

-- DropIndex
DROP INDEX "_LookToSet_B_index";

-- DropTable (manually updated to simply rename)
ALTER TABLE "_LookToSet" RENAME "A" TO "lookId";
ALTER TABLE "_LookToSet" RENAME "B" TO "boardId";
ALTER TABLE "_LookToSet" RENAME "boardId" TO "A";
ALTER TABLE "_LookToSet" RENAME "lookId" TO "B";
ALTER TABLE "_LookToSet" RENAME TO "_BoardToLook";

-- DropTable (manually updated to simply rename)
ALTER TABLE "_SetToVariant" RENAME TO "_BoardToVariant";

-- CreateIndex
CREATE UNIQUE INDEX "Board_name_authorId_key" ON "Board"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToLook_AB_unique" ON "_BoardToLook"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToLook_B_index" ON "_BoardToLook"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToVariant_AB_unique" ON "_BoardToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToVariant_B_index" ON "_BoardToVariant"("B");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToLook" ADD CONSTRAINT "_BoardToLook_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToLook" ADD CONSTRAINT "_BoardToLook_B_fkey" FOREIGN KEY ("B") REFERENCES "Look"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToVariant" ADD CONSTRAINT "_BoardToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToVariant" ADD CONSTRAINT "_BoardToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
