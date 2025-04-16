import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export async function getEventRoute(app: FastifyInstance) {
    const prisma = new PrismaClient();
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/events/:eventId", {
            schema: {
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    200: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        slug: z.string(),
                        detail: z.string().nullable(),
                        maxAttendees: z.number().nullable(),
                        attendeesAmount: z.number(),
                    }),
                },
            }
        }
            , async (request, reply) => {
                const { eventId } = request.params;
                const event = await prisma.event.findUnique({
                    select: {
                        id: true,
                        title: true,
                        detail: true,
                        slug: true,
                        maxAttendees: true,
                        _count: {
                            select: {
                                attendees: true,
                            }
                        },
                    },
                    where: {
                        id: eventId,
                    },
                });
                if (event === null) {
                    throw new Error("Event not found");
                }
                return reply.status(200).send({
                    id: event.id,
                    title: event.title,
                    detail: event.detail,
                    maxAttendees: event.maxAttendees,
                    attendeesAmount: event._count.attendees,
                    slug: event.slug,

                });
            });
}