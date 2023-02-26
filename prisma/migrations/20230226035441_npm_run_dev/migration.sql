/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Raffle` table. All the data in the column will be lost.
  - Added the required column `creatorWalletAddress` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ticketSupply" INTEGER NOT NULL,
    "ticketPrice" INTEGER NOT NULL,
    "ticketsSold" INTEGER NOT NULL,
    "endDate" DATETIME NOT NULL,
    "nftContractAddress" TEXT NOT NULL,
    "nftTokenId" TEXT NOT NULL,
    "nftTokenURI" TEXT,
    "nftTokenName" TEXT,
    "nftCollectionName" TEXT,
    "creatorWalletAddress" TEXT NOT NULL,
    "winnerWalletAddress" TEXT
);
INSERT INTO "new_Raffle" ("createdAt", "endDate", "id", "nftCollectionName", "nftContractAddress", "nftTokenId", "nftTokenName", "nftTokenURI", "ticketPrice", "ticketSupply", "ticketsSold", "updatedAt", "winnerWalletAddress") SELECT "createdAt", "endDate", "id", "nftCollectionName", "nftContractAddress", "nftTokenId", "nftTokenName", "nftTokenURI", "ticketPrice", "ticketSupply", "ticketsSold", "updatedAt", "winnerWalletAddress" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
