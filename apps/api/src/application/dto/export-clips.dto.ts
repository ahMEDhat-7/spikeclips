import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class ExportClipsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  sceneIndices!: number[];
}
