import { Controller, Get, Post, Put, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  find(token: string): User {
    const result = this.userService.getByToken(token);

    return result;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create({
      email: 'ant.goncharik@gmail.com',
      password: '',
    });

    return result;
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    const result = this.userService.update({
      email: 'ant.goncharik@gmail.com',
      password: '',
    });

    return result;
  }
}
