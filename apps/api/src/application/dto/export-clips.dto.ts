import { IsArray, ValidateNested, IsNumber, Min, IsOptional, IsString, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class ExportSceneDto {
  @ApiProperty({ description: "Scene start time in seconds", example: 10.5 })
  @IsNumber()
  @Min(0)
  start_time!: number;

  @ApiProperty({ description: "Scene end time in seconds", example: 60.5 })
  @IsNumber()
  @Min(0)
  end_time!: number;

  @ApiProperty({ description: "Peak intensity (optional)", example: 0.85, required: false })
  @IsNumber()
  @Min(0)
  peak_intensity?: number;
}

class CaptionDto {
  @ApiProperty({ description: "Caption text", example: "Check this out!" })
  @IsString()
  text!: string;

  @ApiProperty({ description: "Font family", example: "inter" })
  @IsString()
  font!: string;

  @ApiProperty({ description: "Font size in px", example: 48 })
  @IsNumber()
  size!: number;

  @ApiProperty({ description: "Text color hex", example: "#FFFFFF" })
  @IsString()
  color!: string;

  @ApiProperty({ description: "Position on screen", example: "center", enum: ["top", "center", "bottom"] })
  @IsString()
  position!: string;

  @ApiProperty({ description: "Start frame for this caption", example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  startFrame?: number;

  @ApiProperty({ description: "End frame for this caption", example: 60, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  endFrame?: number;

  @ApiProperty({ description: "Text animation type", example: "pop", enum: ["pop", "slide", "fade", "none"] })
  @IsString()
  animation!: string;
}

class MusicConfigDto {
  @ApiProperty({ description: "Music file key in storage", example: "user-id/abc-track.mp3" })
  @IsString()
  fileKey!: string;

  @ApiProperty({ description: "Music volume 0-1", example: 0.3 })
  @IsNumber()
  @Min(0)
  volume!: number;

  @ApiProperty({ description: "Original audio volume 0-1", example: 1.0 })
  @IsNumber()
  @Min(0)
  originalVolume!: number;

  @ApiProperty({ description: "Fade in seconds", example: 2 })
  @IsNumber()
  @Min(0)
  fadeIn!: number;

  @ApiProperty({ description: "Fade out seconds", example: 2 })
  @IsNumber()
  @Min(0)
  fadeOut!: number;
}

export class ExportClipsDto {
  @ApiProperty({
    description: "Scenes to export as clips (user-defined start/end times)",
    type: [ExportSceneDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportSceneDto)
  scenes!: ExportSceneDto[];

  @ApiPropertyOptional({ description: "Target platform", example: "youtube-shorts", enum: ["youtube-shorts", "instagram-reels", "tiktok"] })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ description: "Output format", example: "mp4", enum: ["mp4", "webm"] })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: "Output quality", example: "1080p", enum: ["720p", "1080p"] })
  @IsOptional()
  @IsString()
  quality?: string;

  @ApiPropertyOptional({ description: "Captions to overlay on clips", type: [CaptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaptionDto)
  captions?: CaptionDto[];

  @ApiPropertyOptional({ description: "Background music configuration" })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MusicConfigDto)
  music?: MusicConfigDto;

  @ApiPropertyOptional({ description: "Selected template ID", example: "kinetic-typography" })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ description: "Template configuration override" })
  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, unknown>;
}
