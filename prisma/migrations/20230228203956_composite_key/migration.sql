/*
  Warnings:

  - A unique constraint covering the columns `[raffleId,walletAddress]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Participant_raffleId_walletAddress_key` ON `Participant`(`raffleId`, `walletAddress`);
