/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_externalId_key" ON "PaymentMethod"("externalId");
