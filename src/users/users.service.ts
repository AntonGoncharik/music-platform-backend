import { Injectable } from '@nestjs/common';

import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  getByToken(data: string): User {
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
