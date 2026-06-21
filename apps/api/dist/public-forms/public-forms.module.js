"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicFormsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const public_forms_controller_1 = require("./public-forms.controller");
const public_forms_service_1 = require("./public-forms.service");
const tenants_module_1 = require("../tenants/tenants.module");
const prisma_service_1 = require("../common/prisma.service");
const api_request_log_interceptor_1 = require("../integrations/api-request-log.interceptor");
const integration_auth_guard_1 = require("../integrations/integration-auth.guard");
let PublicFormsModule = class PublicFormsModule {
};
exports.PublicFormsModule = PublicFormsModule;
exports.PublicFormsModule = PublicFormsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.FORM_LINK_SECRET || "change-me",
                signOptions: { expiresIn: "1d" }
            }),
            tenants_module_1.TenantsModule
        ],
        controllers: [public_forms_controller_1.PublicFormsController],
        providers: [public_forms_service_1.PublicFormsService, prisma_service_1.PrismaService, api_request_log_interceptor_1.ApiRequestLogInterceptor, integration_auth_guard_1.ExternalIntegrationAuthGuard],
        exports: [public_forms_service_1.PublicFormsService]
    })
], PublicFormsModule);
//# sourceMappingURL=public-forms.module.js.map