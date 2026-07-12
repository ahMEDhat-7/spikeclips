import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ description: "User email address", example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Password (min 8 characters)", example: "securePassword123" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ description: "Display name", example: "John Doe" })
  @IsString()
  @MaxLength(255)
  name!: string;
}
