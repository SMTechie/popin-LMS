import { Request, Response, NextFunction } from "express";
export declare class HttpsEnforceMiddleware {
    use(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
}
