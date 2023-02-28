/*
  Warnings:

  - Added the required column `numTickets` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `numTickets` INTEGER NOT NULL;
