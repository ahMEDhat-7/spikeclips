import { IsString, IsNotEmpty, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateJobDto {
  @ApiProperty({
    description: "YouTube video URL to analyze",
    example: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: true })
  url!: string;
}
