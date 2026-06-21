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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSecretDto = exports.UpdateMarketingIntegrationDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateMarketingIntegrationDto {
    websiteBaseUrl;
    shopApiEnabled;
    webhookEnabled;
    webhookTargetUrl;
    applicationFormApiEnabled;
    publicApplyBaseUrl;
    syncMode;
    defaultCatalogVisibility;
    environment;
    requestSigningMode;
    requestTimeoutSeconds;
    retryPolicy;
    customHeaders;
    catalogEndpoint;
    callbackEndpoint;
}
exports.UpdateMarketingIntegrationDto = UpdateMarketingIntegrationDto;
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "websiteBaseUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMarketingIntegrationDto.prototype, "shopApiEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMarketingIntegrationDto.prototype, "webhookEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "webhookTargetUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMarketingIntegrationDto.prototype, "applicationFormApiEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "publicApplyBaseUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "syncMode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "defaultCatalogVisibility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "requestSigningMode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMarketingIntegrationDto.prototype, "requestTimeoutSeconds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateMarketingIntegrationDto.prototype, "retryPolicy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateMarketingIntegrationDto.prototype, "customHeaders", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "catalogEndpoint", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMarketingIntegrationDto.prototype, "callbackEndpoint", void 0);
class GenerateSecretDto {
    reason;
}
exports.GenerateSecretDto = GenerateSecretDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateSecretDto.prototype, "reason", void 0);
//# sourceMappingURL=dto.js.map