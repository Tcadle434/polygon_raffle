/*
  Warnings:

  - You are about to drop the column `userId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `walletAddress` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `userId`,
    ADD COLUMN `walletAddress` VARCHAR(191) NOT NULL;
