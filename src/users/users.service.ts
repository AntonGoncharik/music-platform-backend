import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { User } from './interfaces/user.interface';

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

  create(data: User): User {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }

  update(data: User): User {
    return {
      firstName: 'Anton',
      lastName: 'Goncharik',
      email: 'ant.goncharik@gmail.com',
      password: '',
      avatarUrl: '',
    };
  }
}
