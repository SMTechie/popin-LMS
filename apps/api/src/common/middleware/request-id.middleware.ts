import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

export class RequestIdMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existing = req.headers["x-request-id"] as string | undefined;
    const requestId = existing || uuid();
    req.headers["x-request-id"] = requestId;
    res.setHeader("x-request-id", requestId);
    next();
  }
}
