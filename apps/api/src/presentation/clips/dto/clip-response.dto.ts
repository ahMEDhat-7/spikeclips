import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ClipResponseDto {
  @ApiProperty({ description: "Clip UUID" })
  id!: string;

  @ApiProperty({ description: "Parent job UUID" })
  jobId!: string;

  @ApiProperty({ description: "Scene index in the job", example: 0 })
  sceneIndex!: number;

  @ApiProperty({ description: "Start time in seconds", example: 100.5 })
  startTime!: number;

  @ApiProperty({ description: "End time in seconds", example: 115.2 })
  endTime!: number;

  @ApiPropertyOptional({ description: "Peak engagement intensity", example: 0.95 })
  peakIntensity?: number;

  @ApiProperty({ description: "Clip status", enum: ["pending", "processing", "completed", "failed"] })
  status!: string;

  @ApiPropertyOptional({ description: "Download URL for the clip" })
  fileUrl?: string;

  @ApiPropertyOptional({ description: "File size in bytes", example: 2048000 })
  fileSize?: number;

  @ApiPropertyOptional({ description: "Clip duration in seconds", example: 14.7 })
  duration?: number;

  @ApiPropertyOptional({ description: "Error message if processing failed" })
  errorMessage?: string;

  @ApiProperty({ description: "Creation timestamp" })
  createdAt!: Date;

  @ApiPropertyOptional({ description: "Completion timestamp" })
  completedAt?: Date;
}
