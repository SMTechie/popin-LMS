"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const app_module_1 = require("./app.module");
const request_id_middleware_1 = require("./common/middleware/request-id.middleware");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const https_middleware_1 = require("./common/middleware/https.middleware");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "log", "debug"],
        bodyParser: false
    });
    app.use((0, express_1.json)({ limit: process.env.REQUEST_BODY_LIMIT || "30mb" }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: process.env.REQUEST_BODY_LIMIT || "30mb" }));
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || ""));
    app.use(new https_middleware_1.HttpsEnforceMiddleware().use);
    const corsOrigins = (process.env.CORS_ORIGINS || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    app.enableCors({
        origin: corsOrigins.length ? corsOrigins : ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    });
    app.use((0, express_rate_limit_1.default)({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
        max: Number(process.env.RATE_LIMIT_MAX || 120),
        standardHeaders: true,
        legacyHeaders: false
    }));
    app.use((0, pino_http_1.default)({
        level: process.env.LOG_LEVEL || "info"
    }));
    app.use(new request_id_middleware_1.RequestIdMiddleware().use);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("POPIN-LMS API")
        .setDescription("External integration endpoints")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("docs", app, document);
    const port = Number(process.env.PORT || 4000);
    await app.listen(port);
    console.log(`POPIN-LMS API listening on ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map