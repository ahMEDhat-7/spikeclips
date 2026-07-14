import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ description: "User ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  userId!: string;

  @ApiProperty({ description: "User email", example: "user@example.com" })
  email!: string;

  @ApiPropertyOptional({ description: "User display name", example: "John Doe" })
  name?: string;

  @ApiProperty({ description: "User plan tier", example: "free" })
  plan!: string;

  @ApiProperty({ description: "Analyses used this month", example: 1 })
  analysesUsed!: number;

  @ApiProperty({ description: "Analyses limit", example: 3 })
  analysesLimit!: number;

  @ApiProperty({ description: "Scenes limit", example: 3 })
  scenesLimit!: number;
}
