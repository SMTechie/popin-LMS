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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const allow_anon_decorator_1 = require("../common/decorators/allow-anon.decorator");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    signup(dto) {
        return this.auth.signup(dto);
    }
    login(dto) {
        return this.auth.login(dto);
    }
    oauth(dto) {
        return this.auth.oauthSignin(dto);
    }
    providers() {
        return this.auth.publicProviders();
    }
    oauthStart(provider, portal = "parent") {
        return this.auth.oauthStart(provider, portal);
    }
    async oauthCallbackGet(provider, code, state, res) {
        const token = await this.auth.oauthCallback(provider, code, state);
        return res.redirect(`${process.env.WEB_URL || "http://localhost:3000"}/login?token=${encodeURIComponent(token.accessToken)}`);
    }
    async oauthCallbackPost(provider, code, state, res) {
        const token = await this.auth.oauthCallback(provider, code, state);
        return res.redirect(`${process.env.WEB_URL || "http://localhost:3000"}/login?token=${encodeURIComponent(token.accessToken)}`);
    }
    me(req) {
        return this.auth.me(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("oauth"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.OAuthSigninDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "oauth", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Get)("providers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "providers", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Get)("oauth/:provider/start"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Query)("portal")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "oauthStart", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Get)("oauth/:provider/callback"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Query)("code")),
    __param(2, (0, common_1.Query)("state")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauthCallbackGet", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("oauth/:provider/callback"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Body)("code")),
    __param(2, (0, common_1.Body)("state")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauthCallbackPost", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map