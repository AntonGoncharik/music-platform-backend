import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { FilesModule } from '../../modules/files/files.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [FilesModule],
})
export class TracksModule {}
