import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class OAuthSigninDto {
  @IsString()
  provider!: "google" | "apple" | "microsoft";

  @IsString()
  providerAccountId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name?: string;
}
