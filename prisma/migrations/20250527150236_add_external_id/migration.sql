/*
  Warnings:

  - Added the required column `externalId` to the `SocialAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN     "externalId" TEXT NOT NULL;
