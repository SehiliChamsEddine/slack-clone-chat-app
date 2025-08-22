import express from 'express';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';
import { functions, inngest } from './config/inngest.js';
import { clerkMiddleware } from '@clerk/express';
const app = express();
app.use(express.json());
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(clerkMiddleware());
app.get('/', (req, res) => {
    res.send('Hello Chams Eddine!');
});
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
