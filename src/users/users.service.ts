import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { IUser } from './interfaces';
import { UserModel } from './models';
import { UpdateUserDto } from './dto';
import { DECODING_FIELDS } from './constants';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  getUserByToken(data: string) {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }

  async createUser(user: IUser): Promise<number> {
    const userModel = new UserModel(user);

    const result = await this.databaseService.query(
      `INSERT INTO users (email, password, activationLink)
        VALUES (?, ?, ?);`,
      [userModel.email, userModel.password, userModel.activationLink],
    );

    return result.insertId;
  }

  async updateUser(userDto: UpdateUserDto): Promise<void> {
    const userModel = new UserModel(userDto, true);

    const dataForUpdate = Object.keys(userModel).map(
      (item) => `${DECODING_FIELDS[item]} = '${userDto[item]}'`,
    );

    await this.databaseService.query(
      `UPDATE users
        SET ${dataForUpdate.join()}
        WHERE id = ?;`,
      [userDto.id],
    );
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
}
