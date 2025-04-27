/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - Added the required column `address` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `CompanySetting` table without a default value. This is not possible if the table is not empty.
  - Made the column `defaultRoleId` on table `CompanySetting` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_countryId_fkey";

-- DropIndex
DROP INDEX "Company_email_key";

-- DropIndex
DROP INDEX "Company_phone_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "countryId",
DROP COLUMN "coverImage",
DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "industry",
DROP COLUMN "logoUrl",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "CompanySetting" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "countryId" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "timezone" DROP DEFAULT,
ALTER COLUMN "language" DROP DEFAULT,
ALTER COLUMN "currency" DROP DEFAULT,
ALTER COLUMN "defaultRoleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CompanySetting" ADD CONSTRAINT "CompanySetting_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
