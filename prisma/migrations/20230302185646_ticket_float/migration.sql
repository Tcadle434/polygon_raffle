/*
  Warnings:

  - You are about to alter the column `ticketPrice` on the `Raffle` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Raffle` MODIFY `ticketPrice` DOUBLE NOT NULL;
