import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto, OAuthSigninDto } from "./dto";
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    oauth(dto: OAuthSigninDto): Promise<void>;
    providers(): Promise<{
        provider: string;
        displayName: string;
        enabled: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    oauthStart(provider: string, portal?: string): Promise<{
        authorizationUrl: string;
    }>;
    oauthCallbackGet(provider: string, code: string, state: string, res: Response): Promise<void>;
    oauthCallbackPost(provider: string, code: string, state: string, res: Response): Promise<void>;
    me(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        userType: string;
        roles: string[];
        permissions: string[];
    }>;
}
