import { IsString, IsNotEmpty, IsUrl } from "class-validator";

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
