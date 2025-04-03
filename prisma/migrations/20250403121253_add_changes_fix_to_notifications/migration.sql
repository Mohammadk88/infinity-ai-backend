/*
  Warnings:

  - You are about to drop the column `referenceId` on the `Notification` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'TASK_ASSIGNED', 'POST_PUBLISHED');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "referenceId",
ADD COLUMN     "link" TEXT,
ADD COLUMN     "linkText" TEXT,
ADD COLUMN     "linkType" TEXT,
ADD COLUMN     "moduleId" TEXT,
ADD COLUMN     "moduleType" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
