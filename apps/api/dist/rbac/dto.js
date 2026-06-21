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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRolePermissionsDto = exports.UpsertPermissionDto = exports.AssignRoleDto = exports.CreateRoleDto = void 0;
const class_validator_1 = require("class-validator");
const shared_1 = require("@popin/shared");
class CreateRoleDto {
    name;
    description;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
class AssignRoleDto {
    userId;
    roleId;
}
exports.AssignRoleDto = AssignRoleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignRoleDto.prototype, "roleId", void 0);
class UpsertPermissionDto {
    module;
    action;
    boardId;
    stageId;
}
exports.UpsertPermissionDto = UpsertPermissionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", typeof (_a = typeof shared_1.ModuleKey !== "undefined" && shared_1.ModuleKey) === "function" ? _a : Object)
], UpsertPermissionDto.prototype, "module", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", typeof (_b = typeof shared_1.PermissionAction !== "undefined" && shared_1.PermissionAction) === "function" ? _b : Object)
], UpsertPermissionDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertPermissionDto.prototype, "boardId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertPermissionDto.prototype, "stageId", void 0);
class UpdateRolePermissionsDto {
    roleId;
    permissions;
}
exports.UpdateRolePermissionsDto = UpdateRolePermissionsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRolePermissionsDto.prototype, "roleId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateRolePermissionsDto.prototype, "permissions", void 0);
//# sourceMappingURL=dto.js.map