import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AllowAnon } from "../common/decorators/allow-anon.decorator";
import { LoginDto, SignupDto, OAuthSigninDto } from "./dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @AllowAnon()
  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @AllowAnon()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @AllowAnon()
  @Post("oauth")
  oauth(@Body() dto: OAuthSigninDto) {
    return this.auth.oauthSignin(dto);
  }

  @AllowAnon()
  @Get("providers")
  providers() {
    return this.auth.publicProviders();
  }

  @AllowAnon()
  @Get("oauth/:provider/start")
  oauthStart(@Param("provider") provider: string, @Query("portal") portal = "parent") {
    return this.auth.oauthStart(provider, portal);
  }

  @AllowAnon()
  @Get("oauth/:provider/callback")
  async oauthCallbackGet(@Param("provider") provider: string, @Query("code") code: string, @Query("state") state: string, @Res() res: Response) {
    const token = await this.auth.oauthCallback(provider, code, state);
    return res.redirect(`${process.env.WEB_URL || "http://localhost:3000"}/login?token=${encodeURIComponent(token.accessToken)}`);
  }

  @AllowAnon()
  @Post("oauth/:provider/callback")
  async oauthCallbackPost(@Param("provider") provider: string, @Body("code") code: string, @Body("state") state: string, @Res() res: Response) {
    const token = await this.auth.oauthCallback(provider, code, state);
    return res.redirect(`${process.env.WEB_URL || "http://localhost:3000"}/login?token=${encodeURIComponent(token.accessToken)}`);
  }


  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.auth.me(req.user.id);
  }
}
