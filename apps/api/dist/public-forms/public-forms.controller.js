"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicFormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_auth_guard_1 = require("../integrations/integration-auth.guard");
const api_request_log_interceptor_1 = require("../integrations/api-request-log.interceptor");
const public_forms_service_1 = require("./public-forms.service");
let PublicFormsController = class PublicFormsController {
    forms;
    constructor(forms) {
        this.forms = forms;
    }
    createLink(body, req) {
        if (!req.integration?.applicationFormApiEnabled) {
            throw new common_1.ForbiddenException("Application form API disabled");
        }
        return this.forms.createApplicationLink(body.expiresInMinutes || 1440, req.integration);
    }
};
exports.PublicFormsController = PublicFormsController;
__decorate([
    (0, common_1.Post)("application/link"),
    (0, swagger_1.ApiOperation)({ summary: "Generate signed application form link" }),
    (0, swagger_1.ApiHeader)({ name: "Authorization", required: true, description: "Bearer <API_KEY>" }),
    (0, swagger_1.ApiHeader)({ name: "X-Popin-Secret", required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PublicFormsController.prototype, "createLink", null);
exports.PublicFormsController = PublicFormsController = __decorate([
    (0, swagger_1.ApiTags)("Public Forms"),
    (0, common_1.Controller)("api/v1/public/forms"),
    (0, common_1.UseGuards)(integration_auth_guard_1.ExternalIntegrationAuthGuard),
    (0, common_1.UseInterceptors)(api_request_log_interceptor_1.ApiRequestLogInterceptor),
    __metadata("design:paramtypes", [public_forms_service_1.PublicFormsService])
], PublicFormsController);
//# sourceMappingURL=public-forms.controller.js.map