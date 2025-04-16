import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export async function getAttendeeBadgeRoute(app: FastifyInstance) {
    const prisma = new PrismaClient();

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/badge', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int(),
                }),
                response: {
                    200: z.object({
                        badge: z.object({
                            name: z.string(),
                            email: z.string().email(),
                            event: z.string(),
                            checkInUrl: z.string().url(),
                        }),
                    }),
                },
            },
            handler: async (request, reply) => {
                const { attendeeId } = request.params;

                const attendee = await prisma.attendee.findUnique({
                    select: {
                        name: true,
                        email: true,
                        event: {
                            select: {
                                title: true,
                            }
                        }
                    },
                    where: {
                        id: attendeeId,
                    },
                });

                if (!attendee) {
                    throw new Error("Attendee not found");
                }
                const baseUrl = `${request.protocol}://${request.hostname}`;
                const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseUrl);
                return reply.status(200).send({

                    badge: {
                        name: attendee.name,
                        email: attendee.email,
                        event: attendee.event.title,
                        checkInUrl: checkInUrl.toString(),

                    }
                });
            },
        });
}
