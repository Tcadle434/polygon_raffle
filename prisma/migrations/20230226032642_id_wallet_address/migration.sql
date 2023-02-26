/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "raffleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Participant_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("createdAt", "id", "raffleId", "updatedAt", "userId") SELECT "createdAt", "id", "raffleId", "updatedAt", "userId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "walletAddress" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT
);
INSERT INTO "new_User" ("createdAt", "id", "name", "updatedAt", "walletAddress") SELECT "createdAt", "id", "name", "updatedAt", "walletAddress" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");
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
    "creatorId" TEXT NOT NULL,
    "winnerWalletAddress" TEXT,
    CONSTRAINT "Raffle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Raffle" ("createdAt", "creatorId", "endDate", "id", "nftCollectionName", "nftContractAddress", "nftTokenId", "nftTokenName", "nftTokenURI", "ticketPrice", "ticketSupply", "ticketsSold", "updatedAt", "winnerWalletAddress") SELECT "createdAt", "creatorId", "endDate", "id", "nftCollectionName", "nftContractAddress", "nftTokenId", "nftTokenName", "nftTokenURI", "ticketPrice", "ticketSupply", "ticketsSold", "updatedAt", "winnerWalletAddress" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
