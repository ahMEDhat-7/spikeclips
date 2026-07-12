import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "User email address", example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Password", example: "securePassword123" })
  @IsString()
  @MinLength(8)
  password!: string;
}
