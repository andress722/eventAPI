import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";




export async function checkInRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int(),
                }),
                response: {
                    201: z.null()
                },
            },
        }, async (request, reply) => {
            const { attendeeId } = request.params;
            const prisma = new PrismaClient();
            const attendee = prisma.attendee.findUnique({
                where: {
                    id: attendeeId,
                },

            })

            if (!attendee) {
                throw new Error("Attendee not found");
            }
            return reply.status(201).send(null);
        });
}

