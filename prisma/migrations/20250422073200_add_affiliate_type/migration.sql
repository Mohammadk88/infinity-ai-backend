-- CreateEnum
CREATE TYPE "AffiliateType" AS ENUM ('REFERRAL', 'PARTNER', 'RESELLER');

-- AlterTable
ALTER TABLE "Affiliate" ADD COLUMN     "isReseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "AffiliateType" NOT NULL DEFAULT 'REFERRAL';
