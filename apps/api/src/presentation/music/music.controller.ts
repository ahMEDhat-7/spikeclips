import {
  Controller,
  Post,
  Delete,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { Request } from "express";
import { MusicService } from "../../infrastructure/storage/music.service";

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@ApiTags("Music")
@Controller("music")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post("upload")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload background music", description: "Upload an audio file (MP3, WAV, OGG, M4A) for use as background music in clips. Max 10MB." })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Music uploaded successfully", schema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, url: { type: "string" }, size: { type: "number" } } } })
  @ApiResponse({ status: 400, description: "Invalid file type or size" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: MulterFile | undefined,
    @Req() req: Request & { user: { userId: string } }
  ) {
    if (!file) {
      throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);
    }

    const allowedMimes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new HttpException("Invalid file type. Supported: MP3, WAV, OGG, M4A", HttpStatus.BAD_REQUEST);
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new HttpException("File too large. Maximum 10MB.", HttpStatus.BAD_REQUEST);
    }

    return this.musicService.uploadMusic(file, req.user.userId);
  }

  @Delete(":key")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete uploaded music", description: "Remove a previously uploaded music file from storage." })
  @ApiParam({ name: "key", description: "Music file key (URL-encoded)", example: "user-id%2Fabc-track.mp3" })
  @ApiResponse({ status: 200, description: "Music deleted successfully", schema: { type: "object", properties: { deleted: { type: "boolean", example: true } } } })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Music file not found" })
  async delete(@Param("key") key: string) {
    await this.musicService.deleteMusic(decodeURIComponent(key));
    return { deleted: true };
  }
}
