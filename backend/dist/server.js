import './instrument.js';
import { clerkMiddleware } from '@clerk/express';
import * as Sentry from "@sentry/node";
import express from 'express';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';
import { functions, inngest } from './config/inngest.js';
import chatRoutes from './routes/chat.route.js';
const app = express();
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/chat', chatRoutes);
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.get('/', (req, res) => {
    res.send('Hello Chams Eddine!');
});
Sentry.setupExpressErrorHandler(app);
const startServer = async () => {
    await connectDB();
    if (ENV.NODE_ENV !== 'production') {
        try {
            app.listen(ENV.PORT, () => {
                console.log(`Server is running on port ${ENV.PORT}`);
            });
        }
        catch (error) {
            console.error("Error starting server:", error);
        }
    }
};
startServer();
export default app;
