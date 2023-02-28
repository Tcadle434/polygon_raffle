/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Participant_walletAddress_key` ON `Participant`(`walletAddress`);
