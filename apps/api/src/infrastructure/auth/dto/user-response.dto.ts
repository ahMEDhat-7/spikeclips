import { ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiPropertyOptional({ description: "User ID" })
  id!: string;

  @ApiPropertyOptional({ description: "User email" })
  email!: string;

  @ApiPropertyOptional({ description: "Display name" })
  name?: string;

  @ApiPropertyOptional({ description: "Plan tier" })
  plan!: string;

  @ApiPropertyOptional({ description: "Analyses used this month" })
  analysesUsed!: number;

  @ApiPropertyOptional({ description: "Analyses limit" })
  analysesLimit!: number;

  @ApiPropertyOptional({ description: "Account creation timestamp" })
  createdAt!: Date;
}
