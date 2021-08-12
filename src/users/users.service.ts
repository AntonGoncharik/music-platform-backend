import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { IUser } from './interfaces';
import { UserModel } from './models';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  getByToken(data: string) {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }

  async create(data: CreateUserDto): Promise<IUser> {
    try {
      const userModel = new UserModel(data);

      const result = await this.databaseService.query(
        `INSERT INTO users (email, password)
          VALUES (?, ?);`,
        [userModel.email, userModel.password],
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<IUser> {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }
}
