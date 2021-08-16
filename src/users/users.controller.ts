import { Controller, Get, Post, Patch, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  find(token: string) {
    return this.userService.getUserByToken(token);
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch()
  update(@Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(userDto);
  }
}
