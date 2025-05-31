-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('USER', 'COMPANY');

-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'USER';
