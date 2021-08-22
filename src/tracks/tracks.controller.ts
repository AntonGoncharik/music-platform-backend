import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  find() {
    return this.tracksService.getTracks();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('tracks'))
  create(@UploadedFiles() tracks: Express.Multer.File[]) {
    return this.tracksService.createTrack(tracks);
  }
}
