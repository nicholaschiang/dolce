-- CreateTable
CREATE TABLE "_ProductToSet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSet_AB_unique" ON "_ProductToSet"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSet_B_index" ON "_ProductToSet"("B");

-- AddForeignKey
ALTER TABLE "_ProductToSet" ADD CONSTRAINT "_ProductToSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSet" ADD CONSTRAINT "_ProductToSet_B_fkey" FOREIGN KEY ("B") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;
