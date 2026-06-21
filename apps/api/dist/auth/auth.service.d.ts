import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../common/prisma.service";
import { LoginDto, SignupDto, OAuthSigninDto } from "./dto";
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    oauthSignin(dto: OAuthSigninDto): Promise<void>;
    private issueToken;
    me(userId: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        userType: string;
        roles: string[];
        permissions: string[];
    }>;
    publicProviders(): Promise<{
        provider: string;
        displayName: string;
        enabled: boolean;
        settings: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    oauthStart(provider: string, portal?: string): Promise<{
        authorizationUrl: string;
    }>;
    oauthCallback(provider: string, code: string, state: string): Promise<{
        accessToken: string;
    }>;
    private redirectUri;
    private verifyAppleToken;
}
