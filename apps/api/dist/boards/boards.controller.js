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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const boards_service_1 = require("./boards.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let BoardsController = class BoardsController {
    boards;
    constructor(boards) {
        this.boards = boards;
    }
    listBoards() {
        return this.boards.listBoards();
    }
    createBoard(dto) {
        return this.boards.createBoard(dto);
    }
    listCards(boardId, page = "1", pageSize = "20") {
        return this.boards.listCards(boardId, Number(page), Number(pageSize));
    }
    createCard(dto, user) {
        return this.boards.createCard(dto, user.id);
    }
    moveCard(cardId, dto, user) {
        return this.boards.moveCard(cardId, dto, user.id);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)({ module: "board", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoards", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)({ module: "board", action: "create" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createBoard", null);
__decorate([
    (0, common_1.Get)(":boardId/cards"),
    (0, permissions_decorator_1.Permissions)({ module: "board", action: "view", boardIdParam: "boardId" }),
    __param(0, (0, common_1.Param)("boardId")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("pageSize")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listCards", null);
__decorate([
    (0, common_1.Post)("cards"),
    (0, permissions_decorator_1.Permissions)({ module: "board", action: "create" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCardDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createCard", null);
__decorate([
    (0, common_1.Patch)("cards/:cardId/move"),
    (0, permissions_decorator_1.Permissions)({ module: "board", action: "move" }),
    __param(0, (0, common_1.Param)("cardId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.MoveCardDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "moveCard", null);
exports.BoardsController = BoardsController = __decorate([
    (0, common_1.Controller)("boards"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map