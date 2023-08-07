-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LookToSet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Set_name_authorId_key" ON "Set"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "_LookToSet_AB_unique" ON "_LookToSet"("A", "B");

-- CreateIndex
CREATE INDEX "_LookToSet_B_index" ON "_LookToSet"("B");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToSet" ADD CONSTRAINT "_LookToSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Look"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToSet" ADD CONSTRAINT "_LookToSet_B_fkey" FOREIGN KEY ("B") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;
