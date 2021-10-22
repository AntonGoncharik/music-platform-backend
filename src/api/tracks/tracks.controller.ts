import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
  Query,
  Headers,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { TracksService } from './tracks.service';
import { CreateTrackDto, DeleteTrackDto } from './dto';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'Get tracks' })
  @ApiResponse({
    status: 200,
    description: 'Tracks have been gotten.',
    schema: {
      example: ['1', '2'],
    },
  })
  find(
    @Headers('authorization') token: string,
    @Query('userTracks') userTracks: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.tracksService.getTracks(token, userTracks, page, size);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('tracks'))
  @ApiOperation({ summary: 'Create track' })
  @ApiBody({
    description: 'Track data',
    type: CreateTrackDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Track has been created.',
  })
  createTrack(
    @UploadedFiles() tracks: Express.Multer.File[],
    @Body() trackDto: CreateTrackDto,
  ) {
    return this.tracksService.createTrack(tracks, trackDto.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete track' })
  @ApiBody({
    description: 'Track data',
    type: DeleteTrackDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Track has been deleted.',
  })
  deleteTrack(@Body() trackDto: DeleteTrackDto) {
    return this.tracksService.deleteTrack(trackDto.id);
  }
}
