import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ParentService } from "./parent.service";

@Controller("parent")
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(private parent: ParentService) {}
  @Get("children") children(@Req() req: any) { return this.parent.children(req.user.id); }
  @Get("children/:id/overview") overview(@Req() req: any, @Param("id") id: string) { return this.parent.overview(req.user.id, id); }
  @Get("children/:id/fees") fees(@Req() req: any, @Param("id") id: string) { return this.parent.fees(req.user.id, id); }
  @Get("children/:id/applications") applications(@Req() req: any, @Param("id") id: string) { return this.parent.applications(req.user.id, id); }
  @Get("children/:id/teachers") teachers(@Req() req: any, @Param("id") id: string) { return this.parent.teachers(req.user.id, id); }
  @Get("children/:id/hostel") hostel(@Req() req: any, @Param("id") id: string) { return this.parent.hostel(req.user.id, id); }
  @Post("children/:id/hostel/applications") hostelApply(@Req() req: any, @Param("id") id: string, @Body() body: any) { return this.parent.hostelApply(req.user.id, id, body); }
  @Post("children/:id/hostel/concerns") hostelConcern(@Req() req: any, @Param("id") id: string, @Body() body: any) { return this.parent.hostelConcern(req.user.id, id, body); }
  @Get("orders") orders(@Req() req: any) { return this.parent.orders(req.user.id); }
  @Get("tickets") tickets(@Req() req: any) { return this.parent.tickets(req.user.id); }
}
