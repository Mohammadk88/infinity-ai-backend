/*
  Warnings:

  - Added the required column `updatedAt` to the `FileUpload` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `FileUpload` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "FileUpload" ADD COLUMN     "aiCategory" TEXT,
ADD COLUMN     "aiDescription" TEXT,
ADD COLUMN     "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiKeywords" JSONB,
ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "platform" "SocialPlatform",
ADD COLUMN     "postId" TEXT,
ADD COLUMN     "properties" JSONB,
ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "webContentId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "FileType" NOT NULL;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_webContentId_fkey" FOREIGN KEY ("webContentId") REFERENCES "WebContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
