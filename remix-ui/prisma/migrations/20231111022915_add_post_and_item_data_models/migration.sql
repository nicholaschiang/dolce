-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "postId" INTEGER;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "postId" INTEGER;

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColorToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemToStyle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LookToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PostToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PostToVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_url_key" ON "Post"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToItem_AB_unique" ON "_ColorToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToItem_B_index" ON "_ColorToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToStyle_AB_unique" ON "_ItemToStyle"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToStyle_B_index" ON "_ItemToStyle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToProduct_AB_unique" ON "_ItemToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToProduct_B_index" ON "_ItemToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToPost_AB_unique" ON "_ItemToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToPost_B_index" ON "_ItemToPost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LookToPost_AB_unique" ON "_LookToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_LookToPost_B_index" ON "_LookToPost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToProduct_AB_unique" ON "_PostToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToProduct_B_index" ON "_PostToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToVariant_AB_unique" ON "_PostToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToVariant_B_index" ON "_PostToVariant"("B");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToItem" ADD CONSTRAINT "_ColorToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToItem" ADD CONSTRAINT "_ColorToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToStyle" ADD CONSTRAINT "_ItemToStyle_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToStyle" ADD CONSTRAINT "_ItemToStyle_B_fkey" FOREIGN KEY ("B") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToProduct" ADD CONSTRAINT "_ItemToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToProduct" ADD CONSTRAINT "_ItemToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToPost" ADD CONSTRAINT "_ItemToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToPost" ADD CONSTRAINT "_ItemToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToPost" ADD CONSTRAINT "_LookToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Look"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LookToPost" ADD CONSTRAINT "_LookToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToProduct" ADD CONSTRAINT "_PostToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToProduct" ADD CONSTRAINT "_PostToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToVariant" ADD CONSTRAINT "_PostToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToVariant" ADD CONSTRAINT "_PostToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
