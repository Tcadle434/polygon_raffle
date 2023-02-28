/*
  Warnings:

  - A unique constraint covering the columns `[raffleId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Participant_raffleId_key` ON `Participant`(`raffleId`);
