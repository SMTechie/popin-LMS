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
exports.ParentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const parent_service_1 = require("./parent.service");
let ParentController = class ParentController {
    parent;
    constructor(parent) {
        this.parent = parent;
    }
    children(req) { return this.parent.children(req.user.id); }
    overview(req, id) { return this.parent.overview(req.user.id, id); }
    fees(req, id) { return this.parent.fees(req.user.id, id); }
    applications(req, id) { return this.parent.applications(req.user.id, id); }
    teachers(req, id) { return this.parent.teachers(req.user.id, id); }
    hostel(req, id) { return this.parent.hostel(req.user.id, id); }
    hostelApply(req, id, body) { return this.parent.hostelApply(req.user.id, id, body); }
    hostelConcern(req, id, body) { return this.parent.hostelConcern(req.user.id, id, body); }
    orders(req) { return this.parent.orders(req.user.id); }
    tickets(req) { return this.parent.tickets(req.user.id); }
};
exports.ParentController = ParentController;
__decorate([
    (0, common_1.Get)("children"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "children", null);
__decorate([
    (0, common_1.Get)("children/:id/overview"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("children/:id/fees"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "fees", null);
__decorate([
    (0, common_1.Get)("children/:id/applications"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "applications", null);
__decorate([
    (0, common_1.Get)("children/:id/teachers"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "teachers", null);
__decorate([
    (0, common_1.Get)("children/:id/hostel"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "hostel", null);
__decorate([
    (0, common_1.Post)("children/:id/hostel/applications"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "hostelApply", null);
__decorate([
    (0, common_1.Post)("children/:id/hostel/concerns"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "hostelConcern", null);
__decorate([
    (0, common_1.Get)("orders"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "orders", null);
__decorate([
    (0, common_1.Get)("tickets"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentController.prototype, "tickets", null);
exports.ParentController = ParentController = __decorate([
    (0, common_1.Controller)("parent"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [parent_service_1.ParentService])
], ParentController);
//# sourceMappingURL=parent.controller.js.map