import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CreateBoardDto, CreateCardDto, MoveCardDto } from "./dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("boards")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class BoardsController {
  constructor(private boards: BoardsService) {}

  @Get()
  @Permissions({ module: "board", action: "view" })
  listBoards() {
    return this.boards.listBoards();
  }

  @Post()
  @Permissions({ module: "board", action: "create" })
  createBoard(@Body() dto: CreateBoardDto) {
    return this.boards.createBoard(dto);
  }

  @Get(":boardId/cards")
  @Permissions({ module: "board", action: "view", boardIdParam: "boardId" })
  listCards(
    @Param("boardId") boardId: string,
    @Query("page") page = "1",
    @Query("pageSize") pageSize = "20"
  ) {
    return this.boards.listCards(boardId, Number(page), Number(pageSize));
  }

  @Post("cards")
  @Permissions({ module: "board", action: "create" })
  createCard(@Body() dto: CreateCardDto, @CurrentUser() user: { id: string }) {
    return this.boards.createCard(dto, user.id);
  }

  @Patch("cards/:cardId/move")
  @Permissions({ module: "board", action: "move" })
  moveCard(
    @Param("cardId") cardId: string,
    @Body() dto: MoveCardDto,
    @CurrentUser() user: { id: string }
  ) {
    return this.boards.moveCard(cardId, dto, user.id);
  }
}
