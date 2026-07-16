import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: "New display name", example: "John Doe" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}
