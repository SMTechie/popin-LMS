import { Request, Response, NextFunction } from "express";

export class HttpsEnforceMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== "production") return next();

    const proto = (req.headers["x-forwarded-proto"] || req.protocol) as string;
    if (proto !== "https") {
      return res.status(400).json({ message: "HTTPS required" });
    }

    next();
  }
}
