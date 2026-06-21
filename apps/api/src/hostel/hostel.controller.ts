import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { HostelService } from "./hostel.service";

@Controller("hostel")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class HostelController {
  constructor(private hostel: HostelService) {}

  @Get("dashboard") @Permissions({ module: "hostel", action: "hostel.view" }) dashboard() { return this.hostel.dashboard(); }
  @Get("overview") @Permissions({ module: "hostel", action: "hostel.view" }) overview() { return this.hostel.overview(); }
  @Get("reports") @Permissions({ module: "hostel", action: "hostel.reports.view" }) reports() { return this.hostel.reports(); }

  @Post("buildings") @Permissions({ module: "hostel", action: "hostel.setup.manage" }) building(@Body() body: any, @Req() req: any) { return this.hostel.createBuilding(body, req.user.id); }
  @Post("blocks") @Permissions({ module: "hostel", action: "hostel.setup.manage" }) block(@Body() body: any, @Req() req: any) { return this.hostel.createBlock(body, req.user.id); }
  @Post("rooms") @Permissions({ module: "hostel", action: "hostel.setup.manage" }) room(@Body() body: any, @Req() req: any) { return this.hostel.createRoom(body, req.user.id); }

  @Patch("applications/:id") @Permissions({ module: "hostel", action: "hostel.applications.manage" }) application(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.decideApplication(id, body, req.user.id); }
  @Post("applications") @Permissions({ module: "hostel", action: "hostel.applications.manage" }) createApplication(@Body() body: any, @Req() req: any) { return this.hostel.parentApply(req.user.id, body.learnerId, body); }
  @Post("allocations") @Permissions({ module: "hostel", action: "hostel.allocations.manage" }) allocate(@Body() body: any, @Req() req: any) { return this.hostel.allocate(body, req.user.id); }
  @Post("allocations/:id/check-in") @Permissions({ module: "hostel", action: "hostel.allocations.manage" }) checkIn(@Param("id") id: string, @Req() req: any) { return this.hostel.checkIn(id, req.user.id); }
  @Post("allocations/:id/check-out") @Permissions({ module: "hostel", action: "hostel.allocations.manage" }) checkOut(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.checkOut(id, body, req.user.id); }
  @Post("allocations/:id/transfer") @Permissions({ module: "hostel", action: "hostel.allocations.manage" }) transfer(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.transfer(id, body, req.user.id); }

  @Post("roll-calls") @Permissions({ module: "hostel", action: "hostel.attendance.manage" }) rollCall(@Body() body: any, @Req() req: any) { return this.hostel.saveRollCall(body, req.user.id); }
  @Post("meals") @Permissions({ module: "hostel", action: "hostel.meals.manage" }) meal(@Body() body: any, @Req() req: any) { return this.hostel.saveMeal(body, req.user.id); }
  @Post("incidents") @Permissions({ module: "hostel", action: "hostel.incidents.manage" }) incident(@Body() body: any, @Req() req: any) { return this.hostel.createIncident(body, req.user.id); }
  @Patch("incidents/:id") @Permissions({ module: "hostel", action: "hostel.incidents.manage" }) incidentStatus(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.updateIncident(id, body, req.user.id); }
  @Post("maintenance") @Permissions({ module: "hostel", action: "hostel.maintenance.manage" }) maintenance(@Body() body: any, @Req() req: any) { return this.hostel.createMaintenance(body, req.user.id); }
  @Patch("maintenance/:id") @Permissions({ module: "hostel", action: "hostel.maintenance.manage" }) maintenanceStatus(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.updateMaintenance(id, body, req.user.id); }
  @Post("visitors") @Permissions({ module: "hostel", action: "hostel.visitors.manage" }) visitor(@Body() body: any, @Req() req: any) { return this.hostel.checkVisitorIn(body, req.user.id); }
  @Post("visitors/:id/check-out") @Permissions({ module: "hostel", action: "hostel.visitors.manage" }) visitorOut(@Param("id") id: string, @Req() req: any) { return this.hostel.checkVisitorOut(id, req.user.id); }
  @Post("charges") @Permissions({ module: "hostel", action: "hostel.billing.manage" }) charge(@Body() body: any, @Req() req: any) { return this.hostel.createCharge(body, req.user.id); }
  @Patch("charges/:id") @Permissions({ module: "hostel", action: "hostel.billing.manage" }) chargeStatus(@Param("id") id: string, @Body() body: any, @Req() req: any) { return this.hostel.updateCharge(id, body, req.user.id); }
  @Post("notices") @Permissions({ module: "hostel", action: "hostel.communicate" }) notice(@Body() body: any, @Req() req: any) { return this.hostel.createNotice(body, req.user.id); }
}
