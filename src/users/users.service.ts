import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { IUser } from './interfaces';
import { UserModel } from './models';
import { CreateUserDto, UpdateUserDto } from './dto';

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

  async createUser(userDto: CreateUserDto): Promise<number> {
    const userModel = new UserModel(userDto);

    const result = await this.databaseService.query(
      `INSERT INTO users (email, password)
        VALUES (?, ?);`,
      [userModel.email, userModel.password],
    );

    return result.insertId;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    // return {
    //   firstName: 'Anton',
    //   lastName: 'Goncharik',
    //   email: 'ant.goncharik@gmail.com',
    //   password: '',
    //   avatarUrl: '',
    // };
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
