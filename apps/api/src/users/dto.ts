import { IsEmail, IsOptional, IsString, MinLength, IsBoolean } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  active!: boolean;
}
