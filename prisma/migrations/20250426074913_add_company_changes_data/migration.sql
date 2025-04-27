/*
  Warnings:

  - You are about to drop the column `city` on the `CompanySetting` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `CompanySetting` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `CompanySetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "CompanySetting" DROP COLUMN "city",
DROP COLUMN "coverImage",
DROP COLUMN "logoUrl";
