import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const raffleRouter = createTRPCRouter({
  createRaffle: publicProcedure
    .input(
      z.object({
        ticketSupply: z.number(),
        ticketPrice: z.number(),
        ticketsSold: z.number(),
        endDate: z.date(),
        nftContractAddress: z.string(),
        nftTokenId: z.string(),
        nftTokenURI: z.string(),
        nftTokenName: z.string(),
        nftCollectionName: z.string(),
        winnerWalletAddress: z.string(),
        creatorWalletAddress: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        ticketSupply,
        ticketPrice,
        ticketsSold,
        endDate,
        nftContractAddress,
        nftTokenId,
        nftTokenURI,
        nftTokenName,
        nftCollectionName,
        winnerWalletAddress,
        creatorWalletAddress,
      } = input;
      try {
        const response = await ctx.prisma.raffle.create({
          data: {
            ticketSupply: ticketSupply,
            ticketPrice: ticketPrice,
            ticketsSold: ticketsSold,
            endDate: endDate,
            nftContractAddress: nftContractAddress,
            nftTokenId: nftTokenId,
            nftTokenURI: nftTokenURI,
            nftTokenName: nftTokenName,
            nftCollectionName: nftCollectionName,
            winnerWalletAddress: winnerWalletAddress,
            creatorWalletAddress: creatorWalletAddress,
            // creator: {
            //   connect: {
            //     walletAddress: creatorWalletAddress,
            //   },
            // },
          },
        });
        console.log("RESPONSE", response);
      } catch (e) {
        console.log("ERROR", e);
      }
    }),
});
