import fastify from "fastify";

import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"; // Import the ZodTypeProvider

import { createEventRoute } from "./routes/create-event.js";
import { registerForEventRoute } from "./routes/register-for-event.js";
import { getEventRoute } from "./routes/get-event.js";
import { getAttendeeBadgeRoute } from "./routes/get-attendee-badge.js";
import { checkInRoute } from "./routes/check-in.js";
import { getEventAttendee } from "./routes/get-event-attendee.js";
import { registerUserRoute } from './routes/user-register.js';
import { getAllEventsRoute } from './routes/get-all-events.js'; // Ensure the file exists or comment this line if not needed
import cors from '@fastify/cors';
const app = fastify();
await app.register(cors, {
    origin: true, // ou ['http://localhost:19006'] se quiser restringir
});
app.setValidatorCompiler(validatorCompiler); // Set the validator compiler to use Zod
app.setSerializerCompiler(serializerCompiler); // Set the serializer compiler to use Zod
// Set the type provider to use Zod   

app.register(createEventRoute)
app.register(registerForEventRoute)
app.register(getEventRoute)
app.register(getAttendeeBadgeRoute)
app.register(checkInRoute)
app.register(getEventAttendee)
app.register(registerUserRoute)
app.register(getAllEventsRoute) // Register the route for getting all events
app.listen({ port: 3000 },).then(() => {
    console.log("Server is running on port 3000");

})