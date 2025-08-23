import { Request, Response } from "express";

import { generateStreamUserToken } from "../config/stream.js";



export const getStreamToken = (req: Request, res: Response) => {
  const token = generateStreamUserToken((req as any).auth().userId);
  if (token) {
     res.status(200).json({ token });
  } else {
     res.status(500).json({ error: "Failed to generate token" });
}
};
