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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
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
  @ApiOperation({ summary: "Upload background music" })
  @ApiConsumes("multipart/form-data")
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
  @ApiOperation({ summary: "Delete uploaded music" })
  async delete(@Param("key") key: string) {
    await this.musicService.deleteMusic(decodeURIComponent(key));
    return { deleted: true };
  }
}
