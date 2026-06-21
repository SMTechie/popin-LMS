import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { AppModule } from "./app.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { HttpsEnforceMiddleware } from "./common/middleware/https.middleware";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
    bodyParser: false
  });

  app.use(json({ limit: process.env.REQUEST_BODY_LIMIT || "30mb" }));
  app.use(urlencoded({ extended: true, limit: process.env.REQUEST_BODY_LIMIT || "30mb" }));

  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET || ""));
  app.use(new HttpsEnforceMiddleware().use);
  const corsOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  });

  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
      max: Number(process.env.RATE_LIMIT_MAX || 120),
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(
    pinoHttp({
      level: process.env.LOG_LEVEL || "info"
    })
  );

  app.use(new RequestIdMiddleware().use);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("POPIN-LMS API")
    .setDescription("External integration endpoints")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`POPIN-LMS API listening on ${port}`);
}

bootstrap();
