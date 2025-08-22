import express, { Request, Response } from 'express';
import { serve } from 'inngest/express';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';
import { functions, inngest } from './config/inngest.js';

import { clerkMiddleware } from '@clerk/express';
const app = express();
app.use(express.json());
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(clerkMiddleware());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Chams Eddine!');
});

app.listen(ENV.PORT, async() => {
  console.log(`Server is running on port ${ENV.PORT}`);
   connectDB();
});
