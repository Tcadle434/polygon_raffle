import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const participantRouter = createTRPCRouter({
  buyTickets: publicProcedure
    .input(
      z.object({
        numTickets: z.number(),
        buyerWalletAddress: z.string(),
        raffleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { numTickets, buyerWalletAddress, raffleId } = input;
      try {
        const response = await ctx.prisma.participant.upsert({
          where: {
            raffleId_walletAddress: {
              raffleId: raffleId,
              walletAddress: buyerWalletAddress,
            },
          },
          update: {
            numTickets: {
              increment: numTickets,
            },
          },
          create: {
            numTickets: numTickets,
            walletAddress: buyerWalletAddress,
            raffle: {
              connect: {
                id: raffleId,
              },
            },
          },
        });
        console.log("RESPONSE", response);
      } catch (e) {
        console.log("ERROR", e);
      }
    }),

  getAllParticipants: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.participant.findMany();
  }),

  getParticipantsByRaffleId: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.participant.findMany({
        where: {
          raffleId: input,
        },
      });
      return response;
    }),

  getTotalNumTicketsByRaffleId: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.participant.aggregate({
        where: {
          raffleId: input,
        },
        _sum: {
          numTickets: true,
        },
      });
      return response;
    }),

  getParticipantByRaffleIdAndWalletAddress: publicProcedure
    .input(
      z.object({
        raffleId: z.string(),
        walletAddress: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { raffleId, walletAddress } = input;
      const response = await ctx.prisma.participant.findUnique({
        where: {
          raffleId_walletAddress: {
            raffleId: raffleId,
            walletAddress: walletAddress,
          },
        },
      });
      return response;
    }),

  getParticipantByWalletAddress: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.participant.findMany({
        where: {
          walletAddress: input,
        },
      });
      return response;
    }),

  getAllRafflesByParticipantWalletAddress: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.participant.findMany({
        where: {
          walletAddress: input,
        },
        select: {
          raffle: true,
        },
      });
      return response;
    }),

  getTotalNumTicketsByCreatorWalletAddress: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.participant.aggregate({
        where: {
          raffle: {
            creatorWalletAddress: input,
          },
        },
        _sum: {
          numTickets: true,
        },
      });
      return response;
    }),
});
