/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "image",
DROP COLUMN "website";

-- AlterTable
ALTER TABLE "CompanySetting" ADD COLUMN     "city" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "defaultRoleId" TEXT;
