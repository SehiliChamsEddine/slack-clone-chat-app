import express, { Request, Response } from 'express';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Chams Eddine!');
});

app.listen(ENV.PORT, async() => {
  console.log(`Server is running on port ${ENV.PORT}`);
   connectDB();
});
