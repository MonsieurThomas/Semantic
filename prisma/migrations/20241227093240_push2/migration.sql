-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "fileData" DROP NOT NULL,
ALTER COLUMN "fileData" DROP DEFAULT;
