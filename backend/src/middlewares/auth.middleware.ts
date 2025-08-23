import { NextFunction, Request, Response } from "express";


export const protectRoute = (req: Request, res: Response, next: NextFunction) => {

    if ((req as any).auth().isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}