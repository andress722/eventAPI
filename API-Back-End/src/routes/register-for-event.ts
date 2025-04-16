import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export async function registerForEventRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events/:eventId/attendees", {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number(),
                    }),
                },
            },
            // ✅ Aqui vai o handler corretamente definido dentro do objeto
            handler: async (request, reply) => {
                const { name, email } = request.body;
                const { eventId } = request.params;


                const [amountAttendees, event] = await Promise.all([
                    prisma.attendee.count({
                        where: {
                            eventId,
                        },
                    }),
                    prisma.event.findUnique({
                        where: {
                            id: eventId,
                        },
                    }),
                ]);


                const alreadyRegistered = await prisma.attendee.findUnique({
                    where: {
                        eventId_email: {
                            eventId,
                            email
                        }
                    }
                });

                if (alreadyRegistered) {
                    throw new Error("User already registered for this event")
                }

                if (event?.maxAttendees && amountAttendees >= event.maxAttendees) {
                    throw new Error("Event is full")
                }
                // Verifica se o evento existe
                const attendee = await prisma.attendee.create({
                    data: {
                        name,
                        email,
                        eventId,
                    }
                })

                return reply.status(201).send({ attendeeId: attendee.id });
            },
        });
}
