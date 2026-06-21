import { Request, Response, NextFunction } from "express";
export declare class RequestIdMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
