import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: "New display name", example: "John Doe" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ description: "New email address", example: "newemail@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;
}
