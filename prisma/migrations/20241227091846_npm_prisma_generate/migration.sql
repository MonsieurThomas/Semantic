-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT;
