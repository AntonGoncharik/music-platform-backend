import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { FilesService } from '../files/files.service';
import { IUser } from './interfaces';
import { UserModel } from './models';
import { DECODING_FIELDS } from './constants';
import { FileType } from '../files/enums';

@Injectable()
export class UsersService {
  constructor(
    private databaseService: DatabaseService,
    private filesService: FilesService,
  ) {}

  getUserByToken(token: string) {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }

  async getUserByEmail(email: string): Promise<IUser[]> {
    const result = await this.databaseService.query(
      `SELECT id, password 
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email],
    );

    return result;
  }

  async getUserByActivationLink(activationLink: string): Promise<IUser[]> {
    const result = await this.databaseService.query(
      `SELECT id, active  
        FROM users
        WHERE activation_link = ?
        LIMIT 1
      `,
      [activationLink],
    );

    return result;
  }

  async createUser(user: IUser): Promise<number> {
    const userModel = new UserModel(user);

    const result = await this.databaseService.query(
      `INSERT INTO users (email, password, activation_link)
        VALUES (?, ?, ?);`,
      [userModel.email, userModel.password, userModel.activationLink],
    );

    return result.insertId;
  }

  async updateUser(avatar: Express.Multer.File, user: IUser): Promise<void> {
    const userModel = new UserModel(user, true);

    const dataForUpdate = Object.keys(userModel).map(
      (item) => `${DECODING_FIELDS[item]} = '${user[item]}'`,
    );

    if (avatar) {
      const avatarPath = this.filesService.createFile(FileType.IMAGES, avatar);
      dataForUpdate.push(`${DECODING_FIELDS['avatar']} = '${avatarPath.path}'`);
    }

    await this.databaseService.query(
      `UPDATE users
        SET ${dataForUpdate.join()}
        WHERE id = ?;`,
      [`${user.id}`],
    );
  }
}
