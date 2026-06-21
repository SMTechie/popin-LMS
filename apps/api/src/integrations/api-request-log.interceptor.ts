import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class ApiRequestLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const integration = req.integration;
        if (!integration) return;

        const latencyMs = Date.now() - start;
        const statusCode = req.res?.statusCode || 200;
        const ipAddress =
          (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || null;
        const userAgent = req.headers["user-agent"] as string | undefined;
        const headers = {
          "x-popin-secret": req.headers["x-popin-secret"] ? "***" : undefined,
          authorization: req.headers["authorization"] ? "Bearer ***" : undefined,
          "user-agent": userAgent
        };

        await this.prisma.apiRequestLog.create({
          data: {
            tenantId: integration.tenantId,
            integrationId: integration.id,
            endpoint: req.originalUrl,
            method: req.method,
            statusCode,
            latencyMs,
            ipAddress,
            userAgent: userAgent || null,
            headers
          }
        });

        await this.prisma.externalIntegration.update({
          where: { id: integration.id },
          data: { lastApiCallAt: new Date() }
        });
      })
    );
  }
}
