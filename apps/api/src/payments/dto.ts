import { IsBoolean, IsString } from "class-validator";

export class VerifyEftDto {
  @IsString()
  orderId!: string;

  @IsBoolean()
  verified!: boolean;
}
