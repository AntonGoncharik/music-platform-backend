import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import { FileType } from '../files/enums';
import { DatabaseService } from '../database/database.service';
import { FilesService } from '../files/files.service';
import { ITrack } from './interfaces';
import { TrackModel } from './models';
import { UPLOADS } from '../files/constants';

@Injectable()
export class TracksService {
  constructor(
    private filesService: FilesService,
    private databaseService: DatabaseService,
  ) {}

  async getTracks(): Promise<ITrack[]> {
    const result = await this.databaseService.query(
      `SELECT id, name, path  
        FROM tracks;
      `,
      [],
    );

    return result;
  }

  async createTrack(
    tracks: Express.Multer.File[],
    userId: string,
  ): Promise<void> {
    try {
      const values = tracks.map((item) => {
        const trackPaths = this.filesService.createFile(FileType.TRACKS, item);
        const trackModel = new TrackModel({ ...trackPaths, userId });
        return [trackModel.userId, trackModel.name, trackModel.path];
      });

      await this.databaseService.batch(
        `INSERT INTO tracks (user_id, name, path)
        VALUES (?, ?, ?);`,
        values,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTrack(id: string): Promise<void> {
    const result = await this.databaseService.query(
      `SELECT path  
        FROM tracks
        WHERE id = ?;
      `,
      [id],
    );

    if (result[0]) {
      await this.databaseService.query(
        `DELETE FROM tracks
          WHERE id = ?;
        `,
        [id],
      );

      const filePath = path.resolve(__dirname, '..', UPLOADS, result[0].path);
      fs.unlinkSync(filePath);
    }
  }
}
