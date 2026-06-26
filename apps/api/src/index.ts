import { createApp } from "./server";
import { env } from "./env";

const app = await createApp();

await app.listen({ port: env.PORT, host: "0.0.0.0" });
