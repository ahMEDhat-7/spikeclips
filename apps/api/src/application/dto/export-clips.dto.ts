import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ExportClipsDto {
  @ApiProperty({
    description: "Indices of scenes to export as clips",
    example: [0, 2, 4],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  sceneIndices!: number[];
}
