import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { FilesModule } from '../../files/files.module';
import { UsersModule } from '../../api/users/users.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  imports: [FilesModule, UsersModule],
})
export class TracksModule {}
