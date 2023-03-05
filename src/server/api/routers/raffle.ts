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
        contractRaffleId: z.string(),
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
        contractRaffleId,
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
            contractRaffleId: contractRaffleId,
            winnerWalletAddress: winnerWalletAddress,
            creatorWalletAddress: creatorWalletAddress,
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

  updateRaffleWinnerPicked: publicProcedure
    .input(
      z.object({
        raffleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { raffleId } = input;
      try {
        const response = await ctx.prisma.raffle.update({
          where: {
            id: raffleId,
          },
          data: {
            winnerPicked: true,
          },
        });
        console.log("RESPONSE", response);
      } catch (e) {
        console.log("ERROR", e);
      }
    }),

  getRaffleByWinnerWalletAddress: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.raffle.findMany({
        where: {
          winnerWalletAddress: input,
        },
      });
      return response;
    }),

  getRaffleByCreatorWalletAddress: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.raffle.findMany({
        where: {
          creatorWalletAddress: input,
        },
      });
      return response;
    }),

  getRaffleWinnersTotalProfits: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.raffle.findMany({
        where: {
          winnerWalletAddress: input,
        },
        select: {
          ticketPrice: true,
          //need the participant ticket count
          Participant: {
            select: {
              numTickets: true,
            },
          },
        },
      });
      return response;
    }),

  getAllNftTokenIds: publicProcedure.query(async ({ ctx }) => {
    const response = await ctx.prisma.raffle.findMany({
      select: {
        nftTokenId: true,
      },
    });
    return response;
  }),

  updateRaffleWinnerPickedWithWinnerWalletAddress: publicProcedure
    .input(
      z.object({
        raffleId: z.string(),
        winnerWalletAddress: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { raffleId, winnerWalletAddress } = input;
      try {
        const response = await ctx.prisma.raffle.update({
          where: {
            id: raffleId,
          },
          data: {
            winnerWalletAddress: winnerWalletAddress,
            winnerPicked: true,
          },
        });
        console.log("RESPONSE", response);
      } catch (e) {
        console.log("ERROR", e);
      }
    }),
});
