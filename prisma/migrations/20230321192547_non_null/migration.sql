/*
  Warnings:

  - Made the column `contractRaffleId` on table `Raffle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Raffle` MODIFY `contractRaffleId` VARCHAR(191) NOT NULL;
