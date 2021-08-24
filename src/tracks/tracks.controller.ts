import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

import { TracksService } from './tracks.service';
import { CreateTrackDto, DeleteTrackDto } from './dto';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  find() {
    return this.tracksService.getTracks();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('tracks'))
  createTrack(
    @UploadedFiles() tracks: Express.Multer.File[],
    @Body() trackDto: CreateTrackDto,
  ) {
    return this.tracksService.createTrack(tracks, trackDto.userId);
  }

  @Delete()
  deleteTrack(@Body() trackDto: DeleteTrackDto) {
    return this.tracksService.deleteTrack(trackDto.id);
  }
}
