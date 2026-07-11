import { IsString, IsNotEmpty, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateJobDto {
  @ApiProperty({
    description: "YouTube video URL to analyze",
    example: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @ApiProperty({
    description: "User ID of the requesting user",
    example: "user-123",
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
