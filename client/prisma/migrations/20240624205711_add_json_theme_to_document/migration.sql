/*
  Warnings:

  - The `theme` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "themeSize" INTEGER[],
DROP COLUMN "theme",
ADD COLUMN     "theme" TEXT[];
