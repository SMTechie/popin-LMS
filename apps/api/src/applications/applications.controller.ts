import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AllowAnon } from "../common/decorators/allow-anon.decorator";
import { ApplicationsService } from "./applications.service";
import {
  CreateApplicationFormDto,
  PublishFormVersionDto,
  PublicApplicationDto,
  SaveFormVersionDto,
  SubmitApplicationDto,
  UpdateAdmissionsStatusDto,
  ApproveApplicationDto
} from "./dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { TenantsService } from "../tenants/tenants.service";
import { PrismaService } from "../common/prisma.service";

@Controller("applications")
export class ApplicationsController {
  constructor(
    private applications: ApplicationsService,
    private tenants: TenantsService,
    private prisma: PrismaService
  ) {}

  @AllowAnon()
  @Post("public")
  submit(@Body() dto: PublicApplicationDto) {
    return this.applications.createPublicApplication(dto);
  }

  @AllowAnon()
  @Get("new")
  getPublicForm(@Query("token") token?: string) {
    return this.applications.getPublicApplicationForm(token);
  }

  @AllowAnon()
  @Post("new")
  submitPublicForm(@Body() dto: SubmitApplicationDto) {
    return this.applications.submitApplication(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("forms")
  @Permissions({ module: "admissions", action: "applications.form.manage" })
  async listForms() {
    const tenant = await this.tenants.getDefaultTenant();
    return this.prisma.applicationForm.findMany({
      where: { tenantId: tenant.id },
      include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } }
    });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post(":id/approve")
  @Permissions({ module: "admissions", action: "admissions.ticket.manage" })
  approve(@Param("id") id: string, @Body() dto: ApproveApplicationDto, @Req() req: any) {
    return this.applications.approveApplication(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("forms")
  @Permissions({ module: "admissions", action: "applications.form.manage" })
  async createForm(@Body() dto: CreateApplicationFormDto) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.prisma.applicationForm.create({
      data: {
        tenantId: tenant.id,
        name: dto.name,
        slug: dto.slug
      }
    });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("forms/:id")
  @Permissions({ module: "admissions", action: "applications.form.manage" })
  async getForm(@Param("id") id: string) {
    return this.prisma.applicationForm.findUnique({
      where: { id },
      include: { versions: { orderBy: { versionNumber: "desc" } } }
    });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("forms/:id/versions")
  @Permissions({ module: "admissions", action: "applications.form.manage" })
  async saveFormVersion(@Param("id") id: string, @Body() dto: SaveFormVersionDto, @Req() req: any) {
    const latest = await this.prisma.applicationFormVersion.findFirst({
      where: { formId: id },
      orderBy: { versionNumber: "desc" }
    });
    const nextVersion = (latest?.versionNumber || 0) + 1;
    return this.prisma.applicationFormVersion.create({
      data: {
        tenantId: (await this.tenants.getDefaultTenant()).id,
        formId: id,
        versionNumber: nextVersion,
        schemaJson: dto.schema as any,
        createdById: req.user.id
      }
    });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("forms/:id/publish")
  @Permissions({ module: "admissions", action: "applications.form.publish" })
  async publishForm(@Param("id") id: string, @Body() dto: PublishFormVersionDto) {
    await this.prisma.applicationFormVersion.updateMany({
      where: { formId: id },
      data: { isPublished: false }
    });

    const version = await this.prisma.applicationFormVersion.update({
      where: { id: dto.versionId },
      data: { isPublished: true, publishedAt: new Date() }
    });

    await this.prisma.applicationForm.update({
      where: { id },
      data: { status: "published", currentVersionId: version.id }
    });

    return version;
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch("forms/:id/status")
  @Permissions({ module: "admissions", action: "applications.open.close" })
  async updateAdmissionsStatus(@Param("id") id: string, @Body() dto: UpdateAdmissionsStatusDto) {
    return this.prisma.applicationForm.update({
      where: { id },
      data: {
        admissionsOpenState: dto.admissionsOpenState,
        opensAt: dto.opensAt ? new Date(dto.opensAt) : null,
        closesAt: dto.closesAt ? new Date(dto.closesAt) : null,
        closedMessage: dto.closedMessage || null,
        openingMessage: dto.openingMessage || null
      }
    });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get("forms/:id/submissions")
  @Permissions({ module: "admissions", action: "applications.submissions.view" })
  async listSubmissions(@Param("id") id: string) {
    return this.prisma.applicationSubmission.findMany({
      where: { formId: id },
      orderBy: { submittedAt: "desc" }
    });
  }
}
