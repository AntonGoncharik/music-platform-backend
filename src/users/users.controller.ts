import { Controller, Get, Post, Patch, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  find(token: string) {
    const result = this.userService.getByToken(token);

    return result;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.create(createUserDto);

    return result;
  }

  // @Patch()
  // update(@Body() updateUserDto: UpdateUserDto) {
  //   const result = this.userService.update({
  //     email: 'ant.goncharik@gmail.com',
  //     password: '',
  //   });

  //   return result;
  // }
}
