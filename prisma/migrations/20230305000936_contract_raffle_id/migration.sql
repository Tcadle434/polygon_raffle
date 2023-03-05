/*
  Warnings:

  - Added the required column `contractRaffleId` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Raffle` ADD COLUMN `contractRaffleId` VARCHAR(191) NOT NULL;
