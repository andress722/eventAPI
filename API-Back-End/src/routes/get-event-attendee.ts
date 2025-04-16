import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export async function getEventAttendee(app: FastifyInstance) {
    const prisma = new PrismaClient();

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:eventId/attendees', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullish().default("0").transform(Number),
                }),
                response: {
                    200: z.object({
                        attendee: z.array(z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.string(), // Date no JSON vira string
                            checkedInAt: z.string().nullable(), // também
                        })),
                    }),
                },
            },
            handler: async (request, reply) => {
                const { eventId } = request.params;
                const { pageIndex, query } = request.query;

                const attendee = await prisma.attendee.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        checkIn: {
                            select: {
                                createdAt: true,
                            },
                        },
                    },
                    where: query
                        ? {
                            eventId,
                            name: {
                                contains: query,
                            },
                        }
                        : {
                            eventId,
                        },
                    take: 10,
                    skip: pageIndex * 10,
                    orderBy: {
                        createdAt: "desc",
                    },
                });

                return reply.status(200).send({
                    attendee: attendee.map((attendee) => ({
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt.toISOString(),
                        checkedInAt: attendee.checkIn?.createdAt?.toISOString() ?? null,
                    })),
                });
            },
        });
}
