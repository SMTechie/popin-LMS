import { Body, Controller, Post, Req, UseGuards, UseInterceptors, ForbiddenException } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ExternalIntegrationAuthGuard } from "../integrations/integration-auth.guard";
import { ApiRequestLogInterceptor } from "../integrations/api-request-log.interceptor";
import { PublicFormsService } from "./public-forms.service";

@ApiTags("Public Forms")
@Controller("api/v1/public/forms")
@UseGuards(ExternalIntegrationAuthGuard)
@UseInterceptors(ApiRequestLogInterceptor)
export class PublicFormsController {
  constructor(private forms: PublicFormsService) {}

  @Post("application/link")
  @ApiOperation({ summary: "Generate signed application form link" })
  @ApiHeader({ name: "Authorization", required: true, description: "Bearer <API_KEY>" })
  @ApiHeader({ name: "X-Popin-Secret", required: true })
  createLink(@Body() body: { expiresInMinutes?: number }, @Req() req: any) {
    if (!req.integration?.applicationFormApiEnabled) {
      throw new ForbiddenException("Application form API disabled");
    }
    return this.forms.createApplicationLink(body.expiresInMinutes || 1440, req.integration);
  }
}
