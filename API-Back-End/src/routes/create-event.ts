
import { generateSlug } from "../utils/generate-slug.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod"; // Import the ZodTypeProvider
import { FastifyInstance } from "fastify";
const prisma = new PrismaClient();

export async function createEventRoute(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .post("/events", {
            schema: {
                body: z.object({
                    title: z.string().min(4),
                    detail: z.string().min(4).nullable(),
                    maxAttendees: z.number().int().positive().nullable(),

                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid(), // Assuming eventId is a UUID   

                    }),

                }

            }
        }, async (request, reply) => {


            const {
                title,
                detail,
                maxAttendees
            } = request.body;

            const slug = generateSlug(title);

            const eventExists = await prisma.event.findUnique({
                where: {
                    slug
                }
            })

            if (eventExists) {
                return reply.status(400)
            }
            // Create event with slug

            const event = await prisma.event.create({
                data: {
                    title,
                    detail,
                    maxAttendees,
                    slug
                }
            })
            return { eventId: event.id };

        })
}
