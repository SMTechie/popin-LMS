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
exports.HostelController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const hostel_service_1 = require("./hostel.service");
let HostelController = class HostelController {
    hostel;
    constructor(hostel) {
        this.hostel = hostel;
    }
    dashboard() { return this.hostel.dashboard(); }
    overview() { return this.hostel.overview(); }
    reports() { return this.hostel.reports(); }
    building(body, req) { return this.hostel.createBuilding(body, req.user.id); }
    block(body, req) { return this.hostel.createBlock(body, req.user.id); }
    room(body, req) { return this.hostel.createRoom(body, req.user.id); }
    application(id, body, req) { return this.hostel.decideApplication(id, body, req.user.id); }
    createApplication(body, req) { return this.hostel.parentApply(req.user.id, body.learnerId, body); }
    allocate(body, req) { return this.hostel.allocate(body, req.user.id); }
    checkIn(id, req) { return this.hostel.checkIn(id, req.user.id); }
    checkOut(id, body, req) { return this.hostel.checkOut(id, body, req.user.id); }
    transfer(id, body, req) { return this.hostel.transfer(id, body, req.user.id); }
    rollCall(body, req) { return this.hostel.saveRollCall(body, req.user.id); }
    meal(body, req) { return this.hostel.saveMeal(body, req.user.id); }
    incident(body, req) { return this.hostel.createIncident(body, req.user.id); }
    incidentStatus(id, body, req) { return this.hostel.updateIncident(id, body, req.user.id); }
    maintenance(body, req) { return this.hostel.createMaintenance(body, req.user.id); }
    maintenanceStatus(id, body, req) { return this.hostel.updateMaintenance(id, body, req.user.id); }
    visitor(body, req) { return this.hostel.checkVisitorIn(body, req.user.id); }
    visitorOut(id, req) { return this.hostel.checkVisitorOut(id, req.user.id); }
    charge(body, req) { return this.hostel.createCharge(body, req.user.id); }
    chargeStatus(id, body, req) { return this.hostel.updateCharge(id, body, req.user.id); }
    notice(body, req) { return this.hostel.createNotice(body, req.user.id); }
};
exports.HostelController = HostelController;
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("overview"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("reports"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.reports.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "reports", null);
__decorate([
    (0, common_1.Post)("buildings"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.setup.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "building", null);
__decorate([
    (0, common_1.Post)("blocks"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.setup.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "block", null);
__decorate([
    (0, common_1.Post)("rooms"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.setup.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "room", null);
__decorate([
    (0, common_1.Patch)("applications/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.applications.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "application", null);
__decorate([
    (0, common_1.Post)("applications"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.applications.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Post)("allocations"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.allocations.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "allocate", null);
__decorate([
    (0, common_1.Post)("allocations/:id/check-in"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.allocations.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)("allocations/:id/check-out"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.allocations.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Post)("allocations/:id/transfer"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.allocations.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)("roll-calls"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.attendance.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "rollCall", null);
__decorate([
    (0, common_1.Post)("meals"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.meals.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "meal", null);
__decorate([
    (0, common_1.Post)("incidents"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.incidents.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "incident", null);
__decorate([
    (0, common_1.Patch)("incidents/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.incidents.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "incidentStatus", null);
__decorate([
    (0, common_1.Post)("maintenance"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.maintenance.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "maintenance", null);
__decorate([
    (0, common_1.Patch)("maintenance/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.maintenance.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "maintenanceStatus", null);
__decorate([
    (0, common_1.Post)("visitors"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.visitors.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "visitor", null);
__decorate([
    (0, common_1.Post)("visitors/:id/check-out"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.visitors.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "visitorOut", null);
__decorate([
    (0, common_1.Post)("charges"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.billing.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "charge", null);
__decorate([
    (0, common_1.Patch)("charges/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.billing.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "chargeStatus", null);
__decorate([
    (0, common_1.Post)("notices"),
    (0, permissions_decorator_1.Permissions)({ module: "hostel", action: "hostel.communicate" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], HostelController.prototype, "notice", null);
exports.HostelController = HostelController = __decorate([
    (0, common_1.Controller)("hostel"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [hostel_service_1.HostelService])
], HostelController);
//# sourceMappingURL=hostel.controller.js.map