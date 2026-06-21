import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../common/prisma.service";
export declare class ApiRequestLogInterceptor implements NestInterceptor {
    private prisma;
    constructor(prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
