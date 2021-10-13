import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

import { FileType } from '../../files/enums';
import { DatabaseService } from '../../database/database.service';
import { FilesService } from '../../files/files.service';
import { ITrack } from './interfaces';
import { TrackModel } from './models';
import { UPLOADS } from '../../files/constants';
import { UsersService } from '../../api/users/users.service';

@Injectable()
export class TracksService {
  constructor(
    private filesService: FilesService,
    private databaseService: DatabaseService,
    private usersService: UsersService,
  ) {}

  async getTracks(token: string, userTracks: number): Promise<ITrack[]> {
    try {
      const resultUser = await this.usersService.getUserByToken(
        token.split(' ')[1],
      );

      let conditions = '';
      const conditionsValues = [];
      if (userTracks) {
        conditions = ' WHERE user_id = ? ';
        conditionsValues.push(resultUser[0].id);
      }

      const result = await this.databaseService.query(
        `SELECT id, name, path  
          FROM tracks ${conditions};
        `,
        conditionsValues,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createTrack(
    tracks: Express.Multer.File[],
    userId: string,
  ): Promise<void> {
    try {
      const values = [];
      for (const item of tracks) {
        const trackPaths = await this.filesService.createFile(
          FileType.TRACKS,
          item,
        );

        const trackModel = new TrackModel({ ...trackPaths, userId });
        values.push([trackModel.userId, trackModel.name, trackModel.path]);
      }

      await this.databaseService.batch(
        `INSERT INTO tracks (user_id, name, path)
          VALUES (?, ?, ?);
        `,
        values,
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteTrack(id: string): Promise<void> {
    try {
      const result = await this.databaseService.query(
        `SELECT path  
          FROM tracks
          WHERE id = ?;
        `,
        [id],
      );

      if (result[0]) {
        const filePath = path.resolve(__dirname, '..', UPLOADS, result[0].path);

        await fsPromises.unlink(filePath);
        await this.databaseService.query(
          `DELETE FROM tracks
            WHERE id = ?;
          `,
          [id],
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
