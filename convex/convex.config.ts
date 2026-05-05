// convex/convex.config.ts
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config"; // This should now work!

const app = defineApp();
app.use(betterAuth);

export default app;
