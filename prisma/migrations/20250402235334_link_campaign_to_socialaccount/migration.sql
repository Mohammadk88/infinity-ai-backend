-- AlterTable
ALTER TABLE "CampaignPerformance" ADD COLUMN     "clicks" INTEGER,
ADD COLUMN     "conversions" INTEGER,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "costPerClick" DOUBLE PRECISION,
ADD COLUMN     "costPerConversion" DOUBLE PRECISION,
ADD COLUMN     "costPerEngagement" DOUBLE PRECISION,
ADD COLUMN     "costPerImpression" DOUBLE PRECISION,
ADD COLUMN     "costPerReach" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "engagement" INTEGER,
ADD COLUMN     "engagementRate" DOUBLE PRECISION,
ADD COLUMN     "impressions" INTEGER,
ADD COLUMN     "reach" INTEGER;
