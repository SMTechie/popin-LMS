export declare class SignupDto {
    email: string;
    password: string;
    name?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class OAuthSigninDto {
    provider: "google" | "apple" | "microsoft";
    providerAccountId: string;
    email: string;
    name?: string;
}
