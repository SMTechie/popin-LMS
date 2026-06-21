import { Response } from "express";
import { ShopService } from "./shop.service";
export declare class ShopController {
    private shop;
    constructor(shop: ShopService);
    getCatalog(since: string | undefined, page: string | undefined, pageSize: string | undefined, category: string | undefined, visibility: string | undefined, includeVariants: string | undefined, includeImages: string | undefined, status: string | undefined, ifNoneMatch: string | undefined, res: Response, req: any): Promise<Response<any, Record<string, any>> | undefined>;
}
