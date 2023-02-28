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
        nftTokenURI: z.string().nullish(),
        nftTokenName: z.string().nullish(),
        nftCollectionName: z.string().nullish(),
        winnerWalletAddress: z.string().nullish(),
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

  getAllRaffles: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.raffle.findMany();
    return response;
  }),

  getAllRaffleIds: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.raffle.findMany({
      select: {
        id: true,
      },
    });
    return response;
  }),

  getRaffleById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.raffle.findUnique({
        where: {
          id: input,
        },
      });
      return response;
    }),

  updateRaffleTicketsSoldById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        ticketsSold: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ticketsSold } = input;
      try {
        const response = await ctx.prisma.raffle.update({
          where: {
            id: id,
          },
          data: {
            ticketsSold: ticketsSold,
          },
        });
        console.log("RESPONSE", response);
      } catch (e) {
        console.log("ERROR", e);
      }
    }),
});
