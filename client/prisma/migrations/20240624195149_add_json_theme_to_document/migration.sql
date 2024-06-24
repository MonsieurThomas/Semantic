/*
  Warnings:

  - Changed the type of `theme` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "theme",
ADD COLUMN     "theme" JSONB NOT NULL;
