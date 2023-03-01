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
});
